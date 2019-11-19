import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import dotenv from "rollup-plugin-dotenv";
import pkg from "./package.json";

const ensureArray = maybeArr =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const globals = {
  "@livechat/mitt": "mitt",
  "@livechat/platform-client": "Client",
  "promise-controller": "PromiseController",
  shortid: "shortid"
};

const createConfig = ({
  input = "src/index.js",
  output,
  env,
  minimalize = false,
  useGlobals = false
} = {}) => ({
  input,
  output: ensureArray(output).map(format =>
    Object.assign({}, format, {
      name: "ChatSDK",
      globals: useGlobals && globals
    })
  ),
  plugins: [
    autoExternal(),
    dotenv(),
    resolve({ browser: true }),
    babel({ exclude: "node_modules/**" }),
    commonjs(),
    env &&
      replace({
        "process.env.NODE_ENV": JSON.stringify(env)
      }),
    minimalize &&
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
  ].filter(Boolean),
  treeshake: {
    propertyReadSideEffects: false
  }
});

export default [
  createConfig({
    output: [
      {
        file: pkg.module,
        format: "esm"
      },
      {
        file: pkg.cjs,
        format: "cjs"
      }
    ]
  }),
  createConfig({
    env: "development",
    useGlobals: true,
    output: {
      file: pkg.main,
      format: "umd"
    }
  }),
  createConfig({
    env: "production",
    useGlobals: true,
    minimalize: true,
    output: {
      file: pkg.main.replace(/\.js$/, ".min.js"),
      format: "umd"
    }
  })
];
