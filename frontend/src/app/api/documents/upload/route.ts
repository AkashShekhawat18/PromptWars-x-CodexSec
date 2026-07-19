import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chunkText, generateEmbedding } from "@/lib/embeddings";
import { v2 as cloudinary } from "cloudinary";
import { requireAuthUser } from "@/lib/api-auth";

// Configure Cloudinary
cloudinary.config({
  secure: true,
});

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "text/plain"];

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Only PDF and TXT allowed." }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal or injection
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").substring(0, 100);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert to base64 for Cloudinary upload
    const base64Data = buffer.toString("base64");
    const fileDataUri = `data:${file.type};base64,${base64Data}`;

    // 1. Upload to Cloudinary with strict resource typing
    const uploadResult = await cloudinary.uploader.upload(fileDataUri, {
      folder: "neuroflow_documents",
      resource_type: "auto", 
      public_id: `${Date.now()}-${sanitizedName}`,
      // Security options for cloudinary
      allowed_formats: ["pdf", "txt"],
    });

    // 2. Parse if PDF or TXT
    let extractedText = "";
    let pageCount = 0;
    
    if (file.type === "application/pdf") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
      pageCount = pdfData.numpages;
    } else if (file.type === "text/plain") {
      extractedText = buffer.toString("utf-8");
      // Sanitize extracted text briefly
      extractedText = extractedText.replace(/\u0000/g, ""); // strip null bytes
    }

    // 3. Save to database securely bound to userId
    const document = await prisma.document.create({
      data: {
        filename: uploadResult.public_id,
        originalName: sanitizedName,
        mimeType: file.type,
        size: file.size,
        url: uploadResult.secure_url,
        status: "PROCESSING",
        pageCount: pageCount > 0 ? pageCount : null,
        userId: user.id,
      },
    });

    // 4. In background: generate embeddings and vector search chunks
    if (extractedText && extractedText.length > 0) {
      processDocumentBackground(document.id, extractedText).catch((err) => {
        console.error("[Background Processing Error]", err.message);
      });
    } else {
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "ERROR" },
      });
    }

    return NextResponse.json(document, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    console.error("[Upload Error]", msg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function processDocumentBackground(documentId: string, text: string) {
  try {
    const chunks = chunkText(text);
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      if (embedding.length > 0) {
        await prisma.documentChunk.create({
          data: {
            documentId,
            content: chunk,
            embedding: JSON.stringify(embedding),
          },
        });
      }
    }
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "EMBEDDED" },
    });
  } catch (e) {
    console.error("[Background Error]", e);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "ERROR" },
    });
  }
}
