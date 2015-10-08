import {map, merge, drop, isNil} from 'ramda'

export default class Model {
  static findOne(query) {
    let col = db.getCollection(this.name)
    return new Promise((resolve, reject) => {
      col.findOne(query, (error, doc) => {
        if (error) reject(error)
        else resolve(this.create(doc))
      })
    })
  }

  static find(query) {
    let col = db.getCollection(this.name)
    return new Promise((resolve, reject) => {
      col.find(query, (error, docs) => {
        if (error) reject(error)
        else resolve(map(this.create.bind(this), docs))
      })
    })
  }

  static inset(model) {
    let col = db.getCollection(this.name)
    return new Promise((resolve, reject) => {
      col.insert(model, (error, doc) {
        if (error) reject(error)
        else resolve(this.create(doc))
      })
    })
  }

  static remove(query) {
    let col = db.getCollection(this.name)
    return new Promise((resolve, reject) => {
      col.remove(query, (error, numRemoved) {
        if (error) reject(error)
        else resolve(numRemoved)
      })
    })
  }

  update(model) {
    let self = this
    let data = isNil(model) ? this : merge(this, model)
    let {id} = this
    let col = db.getCollection(this.name)
    return new Promise((resolve, reject) => {
      col.update({id}, data, {}, (error, numReplaced) => {
        if (error) reject(error)
        else if (numReplaced === 0) resolve(this)
        else self.getClass().findOne({_id: id})
          .then(model => resolve(model))
          .catch(error => reject(error))
      })
    })
  }

}


export default class Comic {
    static name = 'comics'

    static create(props) {
      let {_id as id} = props
      return new Comic(merge(drop('_id', props), {id}))
    }

    getClass() {
      return Comic
    }
}

let klasses = []
let register = (klass) => {

}
