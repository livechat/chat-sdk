module.exports = function(api) {
  api.cache(false);

  const { NODE_ENV, BABEL_ENV } = process.env;
  const isCJS = BABEL_ENV === "cjs" || NODE_ENV === "test";

  const presets = [
    ["@babel/preset-env", { loose: true, modules: false }]
  ];

  const plugins = [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ];

  if (isCJS) plugins.push("@babel/plugin-transform-modules-commonjs");

  return {
    presets,
    plugins
  };
};
