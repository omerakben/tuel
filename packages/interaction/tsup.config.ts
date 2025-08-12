import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    // tsconfig: "./tsconfig.json", // Remove this line
  },
  external: ["react", "react-dom"],
  clean: true,
});
