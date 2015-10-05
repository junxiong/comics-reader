import comic from './comic'

comic('9924078')
  .then(book => console.log(book))
  .catch('error', error => console.log(error))
