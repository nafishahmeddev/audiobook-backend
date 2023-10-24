import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  build: {
    outDir: "build",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src"),
    },
  },
});
