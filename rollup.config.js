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
    plugins: [
      // Only need to convert the object rest spread operator since that's not part of ES2015
      babel({
        plugins: ['transform-object-rest-spread'],
        babelrc: false
      })
    ]
  },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'cjs/bind-selectors.js',
      format: 'cjs'
    },
    plugins: [
      // Only need to convert the object rest spread operator since that's not part of ES2015
      // Rollup will convert the ES2015 modules to CommonJS
      babel({
        plugins: ['transform-object-rest-spread'],
        babelrc: false
      })
    ]
  },
  {
    input: 'src/bind-selectors.js',
    name: 'bindSelectors',
    output: {
      file: 'umd/bind-selectors.js',
      format: 'umd'
    },
    plugins: [
      // Only need to convert the object rest spread operator since that's not part of ES2015
      // Rollup will convert the ES2015 modules to UMD
      babel({
        plugins: ['transform-object-rest-spread'],
        babelrc: false
      })
    ]
  }
]
