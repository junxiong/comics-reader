// Uncoment below to test loader and stores
// import {length, head} from 'ramda'
//
// import {fetchComic, searchComic} from './common/isomorphic/loader/comic'
// import {Comic, History} from './common/isomorphic/stores'
//
// let findComic = code => Comic.find({code}).then(comics => {
//   if (length(comics) > 0) return head(comics)
//   else return fetchComic(code).then(comic => Comic.insert(comic))
// })
//
// Comic.findOne('TdI8iWMbRViFDuvH')
//   .then(comic => console.log(comic ? comic : 'not found'))
//   .catch(error => console.log(error))
//
// searchComic('血族')
//   .then(comics => console.log(comics))
//   .catch(error => console.log(error.message))
//
// findComic('9924078')
//   .then(comic => console.log(comic ? comic : 'not found'))
//   .catch(error => console.log(error))

// Uncoment below to test utils
import {range} from 'ramda'
import {matrixfy} from './common/isomorphic/utils'

let items = range(0, 100)
let matrixfy9 = matrixfy(9)

console.log(matrixfy9(items))
