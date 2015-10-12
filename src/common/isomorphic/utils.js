import {
  length,
  compose,
  map,
  flatten,
  zip,
  reduce,
  splitEvery,
  concat,
  range
} from 'ramda'

export let matrixfy = cols => list => {
  let delta = cols - (length(list) % cols)
  let toEmpty = n => []
  let line = range(0, cols)
  let acc = map(toEmpty, line)
  return compose(
    map(flatten),
    reduce(zip, acc),
    splitEvery(cols),
    concat(list),
    map(toEmpty),
    range(0)
  )(delta)
}
