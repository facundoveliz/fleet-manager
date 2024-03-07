module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['standard-with-typescript'],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ["client"],
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
