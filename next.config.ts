import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Parent folder C:\Users\vstal has a package-lock.json, so Next/Turbopack can
 * treat the monorepo root as the parent and mis-resolve this app's routes
 * (symptoms: GET / → 404, AppRoutes = never).
 *
 * Pin both the Turbopack filesystem root and file-tracing root to THIS app.
 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep file tracing scoped to this package, not C:\Users\vstal
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
