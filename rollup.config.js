import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      })
    ]
  },

  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      })
    ]
  },

  // Browser UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/aiml-parser.js',
      format: 'umd',
      name: 'AIMLParser',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      })
    ]
  },

  // Minified browser build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/aiml-parser.min.js',
      format: 'umd',
      name: 'AIMLParser',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: true
      })
    ]
  }
];
