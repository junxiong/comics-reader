import path from 'path'
import Collection from 'nedb'
import {map} from 'ramda'

const getPath = (collectionName) => path.join(__dirname, '../../../../db', collectionName)

export const Comics = new Collection(getPath('comics.json'))
export const Histories = new Collection(getPath('Histoies.json'))

export default function connect() {
  return new Promise((resolve, reject) => {
    const loadCollection = collection => new Promise((resolve, reject) => {
      collection.loadDatabase(error => {
        if (error) reject(error)
        else resolve(collection)
      })
    })
    Promise.all(map(loadCollection, [Comics, Histories]))
      .then(collections => resolve(collections))
      .catch(error => reject(error))
  })
}
