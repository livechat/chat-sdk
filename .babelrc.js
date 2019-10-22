const { NODE_ENV, BABEL_ENV } = process.env;
const cjs = BABEL_ENV === "cjs" || NODE_ENV === "test";

const presets = [["@babel/preset-env", { loose: true, modules: false }]];

const plugins = [
  ["@babel/plugin-proposal-class-properties", { loose: true }],
  cjs && "@babel/plugin-transform-modules-commonjs"
].filter(Boolean);

module.exports = { presets, plugins };
