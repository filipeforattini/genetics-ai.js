import minify from 'rollup-plugin-minify'
import { uglify } from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',

    output: {
      format: 'cjs',
      file: './dist/app.cjs.min.js'
    },

    plugins: [
      globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      nodeResolve({
        main: true,
        jsnext: true,
        browser: true,
      }),
      filesize(),
      minify({
        mangle: true
      }),
      uglify({
        mangle: true
      }),
    ],
  },
  {
    input: 'src/index.js',

    output: {
      format: 'cjs',
      file: './dist/app.cjs.js'
    },

    plugins: [
      globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      nodeResolve({
        main: true,
        jsnext: true,
        browser: true,
      }),
      filesize(),
      minify({
        mangle: true
      }),
    ],
  },
  {
    input: 'src/index.js',

    output: {
      name: 'genetics',
      format: 'umd',
      file: './dist/app.umd.js'
    },

    plugins: [
      globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      nodeResolve({
        main: true,
        jsnext: true,
        browser: true,
      }),
      filesize(),
      minify({
        mangle: true
      }),
    ],
  },
  {
    input: 'src/index.js',

    output: {
      name: 'genetics',
      format: 'esm',
      file: './dist/app.esm.js'
    },

    plugins: [
      globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      nodeResolve({
        main: true,
        jsnext: true,
        browser: true,
      }),
      filesize(),
      minify({
        mangle: true
      }),
    ],
  },
];
