# redux-bind-selectors
A Redux [store enhancer](https://github.com/reactjs/redux/blob/master/docs/Glossary.md#store-enhancer) for computing derived state by binding selectors to a [Redux](http://redux.js.org/) store, so that `getState()` incorporates derived data.

```javascript
const store = createStore(
  myReducer,               // The Redux reducer
  {numbers: [4, 6, 9, 2]}, // Initial state (optional)
  bindSelectors({total})   // Bind the `total` selector
)

store.getState()
// {
//   numbers: [4, 6, 9, 2]  // <-- initial state from the store
//   total: 21              // <-- result of the `total` selector
// }
```

## Motivation
A Redux store should contain the *minimum representation* of state, so rather than storing:
```javascript
{
  numbers: [4, 6, 9, 2],
  total: 21 // <-- this can be calculated from `numbers`
}
```
it should just store:
```javascript
{
  numbers: [4, 6, 9, 2]
}
```
and calculate `total` when needed with a selector:
```javascript
const total = state => state.numbers.reduce((sum, value) => sum + value, 0)
```
(Pro tip:  [reselect](https://www.npmjs.com/package/reselect) would be more efficient)

#### But...
Instead of a single, simple state object, **state is now split between the store and a collection of selector functions**, which adds complexity.

#### Solution without `redux-bind-selectors`
Use `mapStateToProps()` in [React Redux](https://www.npmjs.com/package/react-redux), to [connect the selectors to the state](http://redux.js.org/docs/recipes/ComputingDerivedData.html).

#### Solution with `redux-bind-selectors`
Use this module to bind the selectors to the store, so that the store runs the selectors for you, producing a single object.  This approach retains the advantages of minimum state representation, and separation of concerns between reducers and selectors.

#### Which one should I use?
If you are new to React and Redux, then you should initially consider `mapStateToProps()`, as recommended by the [Redux documentation](http://redux.js.org/docs/recipes/ComputingDerivedData.html).

You should try out this module if you are not using React, you prefer to keep view and model logic separate, you live on the edge, or you consider this approach to be more elegant.  It's relatively easy to switch between the two, or do both at the same time.

If the output of `getState()` is used for other purposes (for instance to persist the state), then careful consideration should be given as to how this module will affect that.

## Installation
```
npm install --save redux-bind-selectors
```

## Usage
`bindSelectors()` takes an object where the keys are paths in the state object, and the properties are selector functions.  This is analogous to the Redux `combineSelectors()` function.
```javascript
const enhancer = bindSelectors({
  selector1: myReselectSelector,
  selector2: state => state.a + state.b
})
```
Selectors are pure functions that take the state object as their only argument.  Check out [reselect](https://www.npmjs.com/package/reselect) to build efficient selectors.

A selector cannot have the same path in the state object as a reducer. (This is why we do not simply reuse the `createStructuredSelector()` function from reselect.)

When creating the store, the enhancer should be the last argument to the `createStore()` function.  If you have more than one enhancer, you can use the `compose()` function in Redux to compose them.
```javascript
const store1 = createStore(reducer, enhancer)
const store2 = createStore(reducer, initialState, enhancer)
```

## License
See [LICENSE.md](LICENSE.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
