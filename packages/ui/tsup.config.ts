import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  minify: false,
});
