import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  
  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) {
    return null;
  }

  return {
    id: payload.userId as string,
    email: payload.email as string,
    role: payload.role as string,
    status: payload.status as string,
    name: payload.name as string | undefined,
  };
}

export async function requireAuthUser() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  
  if (user.status === "SUSPENDED") {
    throw new Error("SUSPENDED");
  }
  
  return user;
}
