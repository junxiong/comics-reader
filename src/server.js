import {length, head} from 'ramda'

import {fetchComic, searchComic} from './comic'
import {Comic, History} from './common/isomorphic/stores'

let findComic = code => Comic.find({code}).then(comics => {
  if (length(comics) > 0) return head(comics)
  else return fetchComic(code).then(comic => Comic.insert(comic))
})

Comic.findOne('TdI8iWMbRViFDuvH')
  .then(comic => console.log(comic))
  .catch(error => console.log(error))

searchComic('血族')
  .then(comics => console.log(comics))
  .catch(error => console.log(error.message))

findComic('9924078')
  .then(comic => console.log(comic))
  .catch(error => console.log(error))
