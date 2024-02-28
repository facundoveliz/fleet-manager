module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", tseslint.configs.disableTypeChecked],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "tests/**/*"],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        jest: true
      }
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
};
