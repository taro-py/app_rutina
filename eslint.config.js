import expoConfig from "eslint-config-expo/flat.js";

export default [
  ...expoConfig,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];

