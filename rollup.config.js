import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        outputToFilesystem: true
      })
    ],
    external: ['ajv', 'ajv-formats']
  },

  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['ajv', 'ajv-formats']
  },

  // Browser UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/AIMLParser.js',
      format: 'umd',
      name: 'AIMLParser',
      sourcemap: true,
      globals: {
        'ajv': 'Ajv',
        'ajv-formats': 'addFormats'
      }
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['ajv', 'ajv-formats']
  },

  // Browser UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/AIMLParser.min.js',
      format: 'umd',
      name: 'AIMLParser',
      sourcemap: true,
      globals: {
        'ajv': 'Ajv',
        'ajv-formats': 'addFormats'
      }
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      terser({
        compress: {
          drop_console: true
        }
      })
    ],
    external: ['ajv', 'ajv-formats']
  }
];
