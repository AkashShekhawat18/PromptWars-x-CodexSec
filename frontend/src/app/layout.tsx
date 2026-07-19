import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroFlow AI | Autonomous AI Productivity OS",
  description: "Manage tasks, index knowledge, and orchestrate automated workflows with AI-powered agents.",
  keywords: ["AI", "Productivity", "Operating System", "Tasks", "RAG", "Knowledge Base"],
  openGraph: {
    title: "NeuroFlow AI",
    description: "Your Autonomous AI Productivity Operating System.",
    url: "https://neuroflow.ai",
    siteName: "NeuroFlow AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NeuroFlow AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroFlow AI",
    description: "Your Autonomous AI Productivity Operating System.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0C] text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
