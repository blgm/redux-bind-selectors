/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

import babel from 'rollup-plugin-babel'

export default {
  input: 'src/bind-selectors.js',
  output: ['es', 'cjs', 'umd'].map(format => ({
    format,
    file: `${format}/bind-selectors.js`,
    name: 'bindSelectors',
    sourcemap: true
  })),
  plugins: [
    babel({
      presets: [['env', { modules: false }]],
      plugins: ['transform-object-rest-spread'],
      babelrc: false
    })
  ]
}
