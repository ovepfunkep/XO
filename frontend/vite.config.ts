import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GH Pages friendly: relative assets.
export default defineConfig({
  plugins: [react()],
  base: "./",
  esbuild: {
    charset: "utf8",
  },
});


