import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // `next lint` filtrait ces dossiers implicitement ; avec l'ESLint CLI, c'est
  // à nous de le faire, sinon on lint le code généré dans .next.
  // `next-env.d.ts` est régénéré par Next à chaque build : le linter n'a rien
  // à y dire, et il est de toute façon hors du dépôt.
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      // Runtime Deno, bundle par Netlify au deploiement (voir tsconfig).
      "netlify/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
