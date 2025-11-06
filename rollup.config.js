import minify from 'rollup-plugin-minify'
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',

    output: {
      format: 'cjs',
      file: './dist/app.cjs.min.js',
      inlineDynamicImports: true,
    },

    plugins: [
      builtins(),
      nodePolyfills(),
      commonjs(),
      babel({ 
        babelHelpers: 'bundled' 
      }),
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
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
      file: './dist/app.cjs.js',
      inlineDynamicImports: true,
    },

    plugins: [
      // globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      babel({ 
        babelHelpers: 'bundled' 
      }),
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
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
      file: './dist/app.umd.js',
      inlineDynamicImports: true,
    },

    plugins: [
      // globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      babel({ 
        babelHelpers: 'bundled' 
      }),
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
      file: './dist/app.esm.js',
      inlineDynamicImports: true,
    },

    plugins: [
      // globals(),
      builtins(),
      nodePolyfills(),
      commonjs(),
      babel({ 
        babelHelpers: 'bundled' 
      }),
      getBabelOutputPlugin({
        presets: ['@babel/preset-env']
      }),
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
