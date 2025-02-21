import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["node_modules/", "dist/", "build/"], // نادیده گرفتن پوشه‌های غیرضروری
  },
  {
    languageOptions: {
      ecmaVersion: "latest", // آخرین نسخه جاوااسکریپت
      sourceType: "module", // پشتیبانی از import/export
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier, // پلاگین پرتیه
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
      "no-undef": "error",
      "no-unused-vars": "warn",
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
];
