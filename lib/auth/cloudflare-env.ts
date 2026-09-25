import { env } from "cloudflare:workers";
import type { AuthRuntimeEnvironment } from "./options";

export const authEnvironment = env as unknown as AuthRuntimeEnvironment;
