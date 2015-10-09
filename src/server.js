import {fetchComic, searchComic} from './comic'
import {Comic, History} from './common/isomorphic/stores'

searchComic('血族')
  .then(comics => console.log(comics))
  .catch(error => console.log(error.message))

fetchComic('9924078')
  .then(book => console.log(JSON.stringify(book)))
  .catch('error', error => console.log(error))
