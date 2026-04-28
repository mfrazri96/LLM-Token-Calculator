import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = resolve(fileURLToPath(new URL("../..", import.meta.url)));

export default defineConfig({
  root: rootDir,
  test: {
    environment: "node",
    include: ["tests/backend/**/*.test.ts"]
  }
});
