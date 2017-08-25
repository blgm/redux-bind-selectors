/**
 * Copyright (c) IBM Corp. 2017. All Rights Reserved.
 * This project is licensed under the MIT License, see LICENSE.md
 */

/* eslint-env jest */
import {createStore} from 'redux'
import bindSelectors from './bind-selectors'

describe('Redux Bind Selectors', () => {
  const mockReducer = (state = {foo: 'bar'}, action) => state

  describe('applying the enhancer', () => {
    it('does not break the getState() method', () => {
      const store = createStore(mockReducer, bindSelectors())
      const state = store.getState()
      expect(state).toEqual({foo: 'bar'})
    })

    it('fails if the selector map is not an object', () => {
      expect(() => {
        createStore(
          mockReducer,
          bindSelectors('foo')
        )
      }).toThrow('The selector map must be specified as an object')
    })
  })

  describe('binding selectors', () => {
    it('fails if a selector key has the same name as a key in the initial state', () => {
      expect(() => {
        createStore(mockReducer, bindSelectors({
          foo: () => 42 // Same key in the initial state!!
        }))
      }).toThrowError("The selector key 'foo' cannot be used because it exists in the initial state")
    })

    it('calls a selector with the state, and assigns its value to the derived state', () => {
      const mockSelector = jest.fn().mockReturnValue(42)
      const store = createStore(mockReducer, bindSelectors({
        fake: mockSelector
      }))

      const state = store.getState()
      expect(state).toEqual({
        foo: 'bar', // from the Store
        fake: 42 // derived by the selector
      })

      expect(mockSelector).toHaveBeenCalledTimes(1)
      expect(mockSelector).toHaveBeenCalledWith({foo: 'bar'})
    })

    it('allows more than one selector', () => {
      const mockSelector1 = jest.fn().mockReturnValue(42)
      const mockSelector2 = jest.fn().mockReturnValue('baz')

      const store = createStore(mockReducer, bindSelectors({
        answerToLife: mockSelector1,
        bar: mockSelector2
      }))

      const state = store.getState()
      expect(state).toEqual({
        foo: 'bar', // from the Store
        answerToLife: 42, // derived by the first selector
        bar: 'baz' // derived by the second selector
      })

      expect(mockSelector1).toHaveBeenCalledTimes(1)
      expect(mockSelector1).toHaveBeenCalledWith({foo: 'bar'})
      expect(mockSelector2).toHaveBeenCalledTimes(1)
      expect(mockSelector2).toHaveBeenCalledWith({foo: 'bar'})
    })

    it('does not call the selectors when the state has not changed', () => {
      const mockSelector = jest.fn().mockReturnValue(42)
      const store = createStore(mockReducer, bindSelectors({
        fake: mockSelector
      }))

      store.getState() // Once
      store.getState() // Twice

      expect(mockSelector).toHaveBeenCalledTimes(1)
      expect(mockSelector).toHaveBeenCalledWith({foo: 'bar'})
    })
  })

  describe('end to end scenario', () => {
    it('recalculates the state when the store changes', () => {
      const fakeSubscriber = jest.fn()

      const fakeReducer = (state = {count: 0}, {type, amount}) => {
        if (type === 'increment') {
          state = {count: state.count + amount}
        }
        return state
      }

      const higher = state => state.count + 1
      const lower = state => state.count - 2

      const store = createStore(
        fakeReducer,
        {count: 5}, // Initial state
        bindSelectors({
          higher,
          lower
        })
      )

      // Initial state
      expect(store.getState()).toEqual({
        count: 5,
        higher: 6,
        lower: 3
      })

      // Subscribe and update
      store.subscribe(fakeSubscriber)
      store.dispatch({
        type: 'invalid', // invalid type, should not change store value
        amount: 20000
      })

      // State should be unchanged
      expect(store.getState()).toEqual({
        count: 5,
        higher: 6,
        lower: 3
      })

      // But the subscribers still get called
      expect(fakeSubscriber).toHaveBeenCalledTimes(1)
      fakeSubscriber.mockReset()

      // A real update
      store.dispatch({
        type: 'increment',
        amount: 3
      })

      // State values updates
      expect(store.getState()).toEqual({
        count: 8,
        higher: 9,
        lower: 6
      })

      expect(fakeSubscriber).toHaveBeenCalledTimes(1)
    })
  })
})