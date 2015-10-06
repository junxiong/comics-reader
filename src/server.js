import {fetchComic, searchComic} from './comic'

searchComic('血族')
  .then(comics => console.log(comics))
  .catch(error => console.log(error.message))

fetchComic('9924078')
  .then(book => console.log(book))
  .catch('error', error => console.log(error))
