//Uncoment below to test loader and stores
import {length, head} from 'ramda'

import {fetchComic, searchComic} from './common/isomorphic/loader/comic'
import {Comic, History} from './common/isomorphic/stores'

// let findComic = code => Comic.find({code}).then(comics => {
//   if (length(comics) > 0) return head(comics)
//   else return fetchComic(code).then(comic => Comic.insert(comic))
// })

fetchComic('9924078')
  .then(comic => console.log(comic ? comic : 'not found'))
  .catch(error => console.log(error))

// searchComic('血族')
//   .then(comics => console.log(comics))
//   .catch(error => console.log(error.message))
//
// findComic('9924078')
//   .then(comic => console.log(comic ? comic : 'not found'))
//   .catch(error => console.log(error))

// // Uncoment below to test utils
// import {map, range, isEmpty, filter, complement} from 'ramda'
// import {matrixfy} from './common/isomorphic/utils'
//
// let items = range(0, 100)
// let matrixfy9 = matrixfy(9)
//
// let notEmpty = filter(complement(isEmpty))
//
// console.log(map(notEmpty, matrixfy9(items)))
