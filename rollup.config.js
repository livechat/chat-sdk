import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import dotenv from "rollup-plugin-dotenv";
import autoExternal from "rollup-plugin-auto-external";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";

const ensureArray = maybeArr =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const globals = {
  "@livechat/mitt": "mitt",
  backo2: "Backoff",
  "sockjs-client": "SockJS"
};

const extensions = ["js"];

const createConfig = ({
  input = "src/index.js",
  output,
  env,
  minimalize = false
} = {}) => ({
  input,
  output: ensureArray(output).map(format =>
    Object.assign({}, format, {
      name: "ChatSDK",
      globals
    })
  ),
  plugins: [
    autoExternal(),
    dotenv(),
    resolve({ browser: true, extensions }),
    babel({
      exclude: "node_modules/**",
      extensions,
      babelrcRoots: __dirname + "/../*"
    }),
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
    output: {
      file: pkg.main,
      format: "umd"
    }
  }),
  createConfig({
    env: "production",
    minimalize: true,
    output: {
      file: pkg.main.replace(/\.js$/, ".min.js"),
      format: "umd"
    }
  })
];
