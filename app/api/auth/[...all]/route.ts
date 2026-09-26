function unavailable() {
  return Response.json({ message: "Layanan sesi belum dikonfigurasi." }, { status: 503 });
}

async function handle(method: "GET" | "POST", request: Request) {
  const [{ toNextJsHandler }, { auth, authRuntimeEnabled }] = await Promise.all([
    import("better-auth/next-js"),
    import("@/lib/auth"),
  ]);
  if (!authRuntimeEnabled) return unavailable();
  const handlers = toNextJsHandler(auth);
  return handlers[method](request);
}

export const GET = (request: Request) => handle("GET", request);
export const POST = (request: Request) => handle("POST", request);
