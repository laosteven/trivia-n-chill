import "dotenv/config";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      tailwindcss(),
      sveltekit(),
      {
        name: "socket-io",
        async configureServer(server) {
          if (!server.httpServer) return;
          // Dynamic import to avoid issues with SvelteKit aliases
          const { initSocketServer } = await import("./src/lib/server/socket.js");
          // Cast to any to accommodate Vite's dev server http implementation (http/https/http2)
          initSocketServer(server.httpServer as any);
          console.log("[dev] Socket server initialized using shared implementation");
        },
      },
    ],
    optimizeDeps: {
      include: ["svelte-sonner"],
    },
  };
});
