import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from 'eslint-plugin-import'; // Import the plugin
import eslintPluginReact from 'eslint-plugin-react'; // Import the plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "import": eslintPluginImport, // Use the imported plugin instance
      "react": eslintPluginReact, // Use the imported plugin instance
    },
    rules: {
      // General JavaScript rules
      "no-console": ["warn", { allow: ["warn", "error"] }], // Warn for console.log, allow console.warn and console.error
      "prefer-const": "error", // Enforce const for variables that are never reassigned
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Ignore unused variables starting with _
      "max-lines": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ], // Warn if a file exceeds 300 lines
      "no-duplicate-imports": "error", // Disallow duplicate imports

      // React-specific rules
      "react/no-array-index-key": "warn", // Warn against using array indices as keys in React lists
    },
  },
];

export default eslintConfig;
