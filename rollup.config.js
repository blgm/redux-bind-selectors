/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import {minify} from 'uglify-es'

export default {
  input: 'src/bind-selectors.js',
  name: 'bindSelectors',
  sourcemap: true,
  output: [
    {
      file: 'es/bind-selectors.js',
      format: 'es'
    },
    {
      file: 'cjs/bind-selectors.js',
      format: 'cjs'
    },
    {
      file: 'umd/bind-selectors.js',
      format: 'umd'
    }
  ],
  plugins: [
    babel({
      presets: [['env', {modules: false}]],
      plugins: ['transform-object-rest-spread'],
      babelrc: false
    }),
    uglify(
      {
        output: { // Preserve license
          comments: (node, {type, value}) => type === 'comment2' && value.includes('license')
        }
      },
      minify
    )
  ]
}
