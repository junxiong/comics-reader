import Datastore from 'nedb'
import path from 'path'
import {map, merge, omit, isNil} from 'ramda'

import config from '../../../config'

const DB_PATH = config.development.db

export default function Store(name) {
  let store = new Datastore({
    filename: path.join(DB_PATH, name),
    autoload: true
  })
  let fine = doc => {
    let {id} = doc
    if (isNil(id)) return doc
    else return merge(omit(['id'], doc), {_id: id})
  }
  let refine = doc => {
    let {_id} = doc
    if (isNil(_id)) return doc
    else return merge(omit(['_id'], doc), {id: _id})
  }

  return {
    findOne: id => {
      let query = {_id: id}
      return new Promise((resolve, reject) => {
        store.findOne(query, (error, doc) => {
          if (error) reject(error)
          else resolve(refine(doc))
        })
      })
    },

    find: query => {
      return new Promise((resolve, reject) => {
        store.find(fine(query), (error, docs) => {
          if (error) reject(error)
          else resolve(map(refine, docs))
        })
      })
    },

    insert: model => {
      return new Promise((resolve, reject) => {
        store.insert(model, (error, doc) => {
          if (error) reject(error)
          else resolve(refine(doc))
        })
      })
    },

    update: model => {
      return new Promise((resolve, reject) => {
        let {id} = model
        let query = {_id: id}
        store.update(query, model, {}, (error, numReplaced) => {
          if (error) reject(error)
          else if (numReplaced === 0) return model
          else store.findOne(query, (error, doc) => {
            if (error) reject(error)
            else resolve(refine(doc))
          })
        })
      })
    },

    remove: query => {
      return new Promise((resolve, reject) => {
        store.remove(fine(query), (error, numRemoved) => {
          if (error) reject(error)
          else resolve(numRemoved)
        })
      })
    }
  }
}
