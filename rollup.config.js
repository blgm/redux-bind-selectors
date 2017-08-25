/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'

const plugins = () => [
  babel({
    presets: [['env', {modules: false}]],
    plugins: ['transform-object-rest-spread'],
    babelrc: false
  }),
  uglify({}, minify)
]

export default [
  {
    input: 'src/bind-selectors.js',
    output: {
      file: 'es/bind-selectors.js',
      format: 'es'
    },
    plugins: plugins()
  },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'cjs/bind-selectors.js',
      format: 'cjs'
    },
    plugins: plugins()
  },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'umd/bind-selectors.js',
      format: 'umd'
    },
    plugins: plugins()
  }
]
