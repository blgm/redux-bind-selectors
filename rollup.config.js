/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

import babel from 'rollup-plugin-babel'

export default [
  {
    input: 'src/bind-selectors.js',
    output: {
      file: 'es/bind-selectors.js',
      format: 'es'
    },
    plugins: [babel({
      presets: [['env', {modules: false}]],
      plugins: ['transform-object-rest-spread'],
      babelrc: false
    })]
  },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'cjs/bind-selectors.js',
      format: 'cjs'
    },
    plugins: [babel({
      presets: [['env', {modules: false}]],
      plugins: ['transform-object-rest-spread'],
      babelrc: false
    })] },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'umd/bind-selectors.js',
      format: 'umd'
    },
    plugins: [babel({
      presets: [['env', {modules: false}]],
      plugins: ['transform-object-rest-spread'],
      babelrc: false
    })]
  }
]
