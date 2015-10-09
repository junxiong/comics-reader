import {merge, append, fileter, propEq, isNil, find, findIndex, length, head} from 'ramda'

import {Comic} from '../../../common/isomorphic/stores'
import * as remote from '../../../common/isomorphic/loader/comic'

export const PUSH_STATE = 'PUSH_STATE'
export function pushState(route) {
  return {
    type: PUSH_STATE,
    route
  }
}

export const LOAD_BOOK_SHELF_REQUEST = 'LOAD_BOOK_SHELF_REQUEST'
export const LOAD_BOOK_SHELF_SUCCESS = 'LOAD_BOOK_SHELF_SUCCESS'
export const LOAD_BOOK_SHELF_FAILURE = 'LOAD_BOOK_SHELF_FAILURE'
export function loadBookshelf() {
  return dispatch => {
    dispatch({type: LOAD_BOOK_SHELF_REQUEST, isLoading: true})
    return Comic.find({})
      .then(data => dispatch({data, type: LOAD_BOOK_SHELF_SUCCESS, isLoading: false}))
      .catch(error => dispatch({type: LOAD_BOOK_SHELF_FAILURE, isLoading: false}))
  }
}

export const ADD_BOOK_SHELF_REQUEST = 'ADD_BOOK_SHELF_REQUEST'
export const ADD_BOOK_SHELF_SUCCESS = 'ADD_BOOK_SHELF_SUCCESS'
export const ADD_BOOK_SHELF_FAILURE = 'ADD_BOOK_SHELF_FAILURE'
export function addBookshelf(comic) {
  return dispatch => {
    dispatch({type: ADD_BOOK_SHELF_REQUEST, isAdding: true})
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(append(comic, comics))
      }, 100)
    })
      .then(data => dispatch({data, type: ADD_BOOK_SHELF_SUCCESS, isAdding: false}))
      .catch(error => dispatch({type: ADD_BOOK_SHELF_FAILURE, isAdding: false}))
  }
}

export const DEL_BOOK_SHELF_REQUEST = 'DEL_BOOK_SHELF_REQUEST'
export const DEL_BOOK_SHELF_SUCCESS = 'DEL_BOOK_SHELF_SUCCESS'
export const DEL_BOOK_SHELF_FAILURE = 'DEL_BOOK_SHELF_FAILURE'
export function delBookshelf(id) {
  return dispatch => {
    dispatch({type: DEL_BOOK_SHELF_REQUEST, isDeling: true})
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(filter(propEq('id', id), store.comics))
      }, 100)
    })
      .then(data => dispatch({data, type: DEL_BOOK_SHELF_SUCCESS, isDeling: false}))
      .catch(error => dispatch({type: DEL_BOOK_SHELF_FAILURE, isDeling: false}))
  }
}

export const SEARCH_COMICS_REQUEST = 'SEARCH_COMICS_REQUEST'
export const SEARCH_COMICS_SUCCESS = 'SEARCH_COMICS_SUCCESS'
export const SEARCH_COMICS_FAILURE = 'SEARCH_COMICS_FAILURE'
export function searchComics(query) {
  let action = {query}
  return dispatch => {
    dispatch(merge(action, {isSearching: true, type: SEARCH_COMICS_REQUEST}))
    return remote.searchComic(query)
      .then(data => dispatch(merge(action, {data, isSearching: false, type: SEARCH_COMICS_SUCCESS})))
      .catch(error => dispatch(merge(action, {isSearching: false, type: SEARCH_COMICS_FAILURE})))
  }
}


export const READING_SUCCESS = 'READING_SUCCESS'
export const READING_FAILURE = 'READING_FAILURE'
export function read(screenNo) {
  let action = {type: READING_SUCCESS}
  return (dispatch, getState) => {
    let {comic, reading} = getState()
    let {partNo, volumnNo} = reading
    let {parts} = comic.data
    let currentPart = parts[partNo]
    let {volumns} = currentPart
    let currentVolumn = volumns[volumnNo]
    let {screens} = currentVolumn
    let data = {partNo, volumnNo, screenNo}
    if (screenNo >= 0) {
      if (screenNo >= screens.length) {
        let nextVolumnNo = volumnNo + 1
        if (nextVolumnNo >= volumns.length) {
          let nextPartNo = partNo + 1
          if (nextPartNo >= parts.length) return dispatch(merge(action, {type: READING_FAILURE, error: 'Last screen'}))
          else return dispatch(merge(action, {data}, {partNo: nextPartNo, volumnNo: 0, screenNo: 0}))
        } else return dispatch(merge(action, {data}, {volumnNo: nextVolumnNo, screenNo: 0})) // to next volumn
      } else return dispatch(merge(action, {data})) // to target screen
    } else {
      let preVolumnNo = volumnNo - 1
      if (preVolumnNo < 0) {
        let prePartNo = partNo - 1
        if (prePartNo < 0) return dispatch(merge(action, {type: READING_FAILURE, error: 'First screen'}))
        else return dispatch(merge(action, {data}, {partNo: prePartNo, volumnNo: 0, screenNo: 0}))
      } else return dispatch(merge(action, {data}, {volumnNo: preVolumnNo, screenNo: 0})) // to pre volumn
    }
  }
}

export function readNext() {
  return (dispatch, getState) => {
    let {screenNo} = getState().reading
    return dispatch(read(screenNo + 1))
  }
}

export function readPrevious() {
  return (dispatch, getState) => {
    let {screenNo} = getState().reading
    return dispatch(read(screenNo - 1))
  }
}

export const FETCH_COMIC_REQUEST = 'FETCH_COMIC_REQUEST'
export const FETCH_COMIC_SUCCESS = 'FETCH_COMIC_SUCCESS'
export const FETCH_COMIC_FAILURE = 'FETCH_COMIC_FAILURE'
export function fetchComic(code) {
  return dispatch => {
    dispatch({isFetching: true, type: FETCH_COMIC_REQUEST})
    return Comic.find({code})
      .then(comics => {
        if (length(comics) > 0) return head(comics)
        else return remote.fetchComic(code)
          .then(comic => {
            dispatch(insertComic(comic))
            return comic
          })
      })
        .then(data => {
          dispatch({data, isFetching: false, type: FETCH_COMIC_SUCCESS})
        })
        .catch(error => {
          console.log(error)
          dispatch({isFetching: false, type: FETCH_COMIC_FAILURE})
        })
  }
}

export const INSERT_COMIC_REQUEST = 'INSERT_COMIC_REQUEST'
export const INSERT_COMIC_SUCCESS = 'INSERT_COMIC_SUCCESS'
export const INSERT_COMIC_FAILURE = 'INSERT_COMIC_FAILURE'
export function insertComic(data) {
  return dispatch => {
    dispatch({type: INSERT_COMIC_REQUEST, data})
    return Comic.insert(data)
      .then(data => {
        dispatch({type: INSERT_COMIC_SUCCESS, data})
      })
      .catch(error => {
        console.log(error)
        dispatch({type: INSERT_COMIC_FAILURE})
      })
  }
}

export const LOAD_COMIC_REQUEST = 'LOAD_COMIC_REQUEST'
export const LOAD_COMIC_SUCCESS = 'LOAD_COMIC_SUCCESS'
export const LOAD_COMIC_FAILURE = 'LOAD_COMIC_FAILURE'
export function loadComic(id) {
  return dispatch => {
    dispatch({isFetching: true, type: LOAD_COMIC_REQUEST})
    return Comic.findOne(id)
      .then(data => {
        dispatch({data, isFetching: false, type: LOAD_COMIC_REQUEST})
      })
      .catch(error => {
        console.log(error)
        dispatch({isFetching: false, type: LOAD_COMIC_REQUEST})
      })
  }
}
