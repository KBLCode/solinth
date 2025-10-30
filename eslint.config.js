import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Solinth-specific rules for multi-tenant security
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Simplified rules for now - will enhance when we add more TypeScript code
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
