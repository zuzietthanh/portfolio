import path from "node:path";
import { stat } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";

/**
 * Runs the /api handlers under `npm run dev`.
 *
 * Vercel serves that folder in production, but Vite knows nothing about it, so
 * without this the feedback form only works once deployed — which means the
 * first real test happens on the live site. Same handler files, same request
 * and response objects, so what passes here is what ships.
 *
 * Dev only: `apply: "serve"` keeps it out of the production build.
 */
export default function devApi(routes = ["feedback", "admin"]) {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      // Vercel injects environment variables into the function's process. Vite
      // only exposes them to client code, so mirror the ones the handlers read
      // into process.env — otherwise ADMIN_PASSWORD is unset locally and the
      // review queue can only be tested on the live site.
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const name of [
        "ADMIN_PASSWORD",
        "KV_REST_API_URL",
        "KV_REST_API_TOKEN",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
      ]) {
        if (env[name] && !process.env[name]) process.env[name] = env[name];
      }

      for (const route of routes) {
        const filePath = path.resolve(process.cwd(), "api", `${route}.js`);
        const file = pathToFileURL(filePath).href;

        server.middlewares.use(`/api/${route}`, async (req, res) => {
          try {
            // Node's ESM loader caches by URL, so without this an edit to a
            // handler needs a dev-server restart to take effect. The store the
            // handlers use lives on globalThis, so re-importing loses nothing.
            const { mtimeMs } = await stat(filePath);
            const mod = await import(`${file}?v=${mtimeMs}`);
            await mod.default(req, res);
          } catch (error) {
            server.config.logger.error(`[dev-api] /api/${route}: ${error.stack || error}`);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(error?.message || error) }));
          }
        });
      }
    },
  };
}
