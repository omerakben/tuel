import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false,
  clean: true,
  external: ["react", "react-dom", "three"],
  treeshake: true,
  splitting: false,
  sourcemap: false,
  minify: false,
});
