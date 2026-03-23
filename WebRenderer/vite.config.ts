import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // Redirect all `import … from "shiki"` to our slim shim that bundles
      // only ~47 common languages instead of all 371+.
      shiki: path.resolve(__dirname, "src/shiki-slim.ts"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      fileName: () => "renderer.js",
      formats: ["iife"],
      name: "YiTongRenderer",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "renderer.css";
          }

          return "[name][extname]";
        },
      },
    },
  },
});
