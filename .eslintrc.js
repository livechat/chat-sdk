module.exports = {
  extends: ["standard"],
  parser: "babel-eslint",
  rules: {
    "camelcase": 0,
    "semi": 0,
    "space-before-function-paren": 0,
    "quotes": ["error", "double"],
  },
  overrides: [
    {
      files: ["__tests__/*.js", "__mocks__/*.js"],
      rules: {
        "no-unused-expressions": "off",
        "no-undef": 0
      }
    }
  ]
};
