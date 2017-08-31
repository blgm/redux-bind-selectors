/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

/**
 * A Redux Enhancer that intercepts the getState() method, runs selectors against the state,
 * and merges the results back into a shallow clone of the state object, without polluting the original.
 */

export default function bindSelectors (selectorMap = {}) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let lastStoreState = store.getState()
    let computedState

    // Check the validity of the selector map
    if (typeof selectorMap !== 'object') {
      throw new Error('The selector map must be specified as an object')
    }
    for (const key in selectorMap) {
      if (key in lastStoreState) {
        throw new Error(`The selector key '${key}' cannot be used because it exists in the initial state`)
      }
      if (typeof selectorMap[key] !== 'function') {
        throw new Error(`The selector '${key}' must be a function`)
      }
    }

    const getState = () => {
      const currentStoreState = store.getState()
      // Only recalculate the state if the store state has changed, or we have not computed it before
      if ((currentStoreState !== lastStoreState) || !computedState) {
        lastStoreState = currentStoreState
        let derivedState = {}
        for (const key in selectorMap) {
          derivedState[key] = selectorMap[key](currentStoreState)
          if (typeof derivedState[key] === 'undefined') {
            throw new Error(`Selector '${key}' returned 'undefined'; to indicate no value, return 'null' instead`)
          }
        }

        computedState = {...currentStoreState, ...derivedState}
      }

      return computedState
    }

    return {...store, getState}
  }
}
