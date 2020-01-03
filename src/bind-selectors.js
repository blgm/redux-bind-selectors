/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

/**
 * A Redux Enhancer that intercepts the getState() method, runs selectors against the state,
 * and merges the results back into a shallow clone of the state object, without polluting the original.
 */

export default function bindSelectors (inputSelectorMap = {}) {
  // Check the validity of the selector map object
  if (typeof inputSelectorMap !== 'object') {
    throw new Error('The selector map must be specified as an object')
  }
  const selectorMap = { ...inputSelectorMap }

  // Check that all the selectors are functions
  for (const key in selectorMap) {
    if (typeof selectorMap[key] !== 'function') {
      throw new Error(`The selector '${key}' must be a function`)
    }
  }

  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)

    // Check the initial state
    let lastStoreState = store.getState()
    const stateType = typeof lastStoreState
    if (typeof lastStoreState !== 'object') {
      throw new Error(`The state must be a JavaScript object, not a '${stateType}'`)
    }

    // Check for duplicate keys between the selector map and the initial state
    for (const key in selectorMap) {
      if (key in lastStoreState) {
        throw new Error(`The selector key '${key}' cannot be used because it exists in the initial state`)
      }
    }

    let computedState
    const getState = () => {
      const currentStoreState = store.getState()
      // Only recalculate the state if the store state has changed, or we have not computed it before
      if ((currentStoreState !== lastStoreState) || !computedState) {
        lastStoreState = currentStoreState
        const derivedState = {}
        for (const key in selectorMap) {
          derivedState[key] = selectorMap[key](currentStoreState)
          if (typeof derivedState[key] === 'undefined') {
            throw new Error(`Selector '${key}' returned 'undefined'; to indicate no value, return 'null' instead`)
          }
        }

        computedState = { ...currentStoreState, ...derivedState }
      }

      return computedState
    }

    return { ...store, getState }
  }
}
