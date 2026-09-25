import { toNextJsHandler } from "better-auth/next-js";
import { auth, authRuntimeEnabled } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

function unavailable() {
  return Response.json({ message: "Layanan sesi belum dikonfigurasi." }, { status: 503 });
}

export const GET = (request: Request) => authRuntimeEnabled ? handlers.GET(request) : unavailable();
export const POST = (request: Request) => authRuntimeEnabled ? handlers.POST(request) : unavailable();
