import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  nodeResolve(),
  terser({
    module: true,
    keep_classnames: true
  }),
];

export default [
  {
    input: 'dist/neochess-components.js',
    output: {
      sourcemap: true,
      format: 'esm',
      file: 'dist/neochess-components.bundle.js',
      name: 'NeochessComponents'
    },
    plugins: plugins
  }
];
