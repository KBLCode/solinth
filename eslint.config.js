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
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Enforce tenant filtering patterns
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='prisma'][callee.property.name=/^(findMany|findFirst|findUnique|count|aggregate)$/]:not(:has(Property[key.name='where'] Property[key.name='tenantId']))",
          message:
            "All Prisma queries must include tenantId filter for multi-tenant security",
        },
      ],
    },
  },
];

export default eslintConfig;
