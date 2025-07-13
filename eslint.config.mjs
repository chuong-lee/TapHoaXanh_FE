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
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/app/admin/assets/**",
      "**/*.min.js",
      "**/*.min.css",
      "**/slick/**",
      "**/wow/**",
      "**/webfonts/**",
      "**/fonts/**",
      "**/images/**",
      "**/flags/**",
      "**/scss/**",
      "**/css/**",
      "**/js/**"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@next/next/no-img-element": "warn"
    }
  }
];

export default eslintConfig;
