import {merge, append, fileter, propEq, isNil, find, findIndex, length, head, nth} from 'ramda'

import {Comic, History} from '../../../common/isomorphic/stores'
import * as remote from '../../../common/isomorphic/loader/comic'

export const PUSH_STATE = 'PUSH_STATE'
export function pushState(route) {
  return {
    type: PUSH_STATE,
    route
  }
}

export const ZOOM_IN = 'ZOOM_IN'
export const ZOOM_OUT = 'ZOOM_OUT'
export const ZOOM_TO = 'ZOOM_TO'
export function zoomIn(step) {
  return {
    type: ZOOM_IN,
    step
  }
}
export function zoomOut(step) {
  return {
    type: ZOOM_OUT,
    step
  }
}
export function zoomTo(size) {
  return {
    type: ZOOM_TO,
    size
  }
}

export const ENTER_FULLSCREEN = 'ENTER_FULL_SCREEN'
export const EXIT_FULLSCREEN = 'EXIT_FULL_SCREEN'
export function enterFullscreen() {
  return {type: ENTER_FULLSCREEN}
}
export function exitFullscreen() {
  return {type: EXIT_FULLSCREEN}
}

export const SHOW_SIDER = 'SHOW_SIDER'
export const HIDE_SIDER = 'HIDE_SIDER'
export function showSider() {
  return {type: SHOW_SIDER}
}
export function hideSider() {
  return {type: HIDE_SIDER}
}

export const LOAD_BOOK_SHELF_REQUEST = 'LOAD_BOOK_SHELF_REQUEST'
export const LOAD_BOOK_SHELF_SUCCESS = 'LOAD_BOOK_SHELF_SUCCESS'
export const LOAD_BOOK_SHELF_FAILURE = 'LOAD_BOOK_SHELF_FAILURE'
export function loadBookshelf() {
  return dispatch => {
    dispatch({type: LOAD_BOOK_SHELF_REQUEST})
    return Comic.find({})
      .then(data => dispatch({data, type: LOAD_BOOK_SHELF_SUCCESS}))
      .catch(error => dispatch({type: LOAD_BOOK_SHELF_FAILURE}))
  }
}

export const SEARCH_COMICS_REQUEST = 'SEARCH_COMICS_REQUEST'
export const SEARCH_COMICS_SUCCESS = 'SEARCH_COMICS_SUCCESS'
export const SEARCH_COMICS_FAILURE = 'SEARCH_COMICS_FAILURE'
export function searchComics(query) {
  let action = {query}
  return dispatch => {
    dispatch(merge(action, {type: SEARCH_COMICS_REQUEST}))
    return remote.searchComic(query)
      .then(data => dispatch(merge(action, {data, type: SEARCH_COMICS_SUCCESS})))
      .catch(error => dispatch(merge(action, {type: SEARCH_COMICS_FAILURE})))
  }
}


export const READING_SUCCESS = 'READING_SUCCESS'
export const READING_FAILURE = 'READING_FAILURE'

export function read(target) {
  let action = {type: READING_SUCCESS}
  return (dispatch, getState) => {
    let {comic, reading} = getState()
    let partNo = isNil(target.partNo) ? reading.partNo : target.partNo
    let volumnNo = isNil(target.volumnNo) ? reading.volumnNo : target.volumnNo
    let screenNo = isNil(target.screenNo) ? reading.screenNo : target.screenNo
    let {parts} = comic.data
    let currentPart = parts[partNo]
    let {volumns} = currentPart
    let currentVolumn = volumns[volumnNo]
    let {screens} = currentVolumn
    if (screenNo >= 0) {
      if (screenNo >= screens.length) {
        let nextVolumnNo = volumnNo + 1
        if (nextVolumnNo >= volumns.length) {
          let nextPartNo = partNo + 1
          if (nextPartNo >= parts.length) {
            return dispatch(merge(action, {type: READING_FAILURE, error: 'Last screen'}))
          }
          else {
            let data = {partNo: nextPartNo, volumnNo: 0, screenNo: 0}
            //History.insert(data).catch(error => console.log(error)) // TODO add an action for this
            return dispatch(merge(action, {data}))
          }
        } else {
          let data = {partNo, volumnNo: nextVolumnNo, screenNo: 0}
          return dispatch(merge(action, {data})) // to next volumn
        }
      } else {
        let data = {partNo, volumnNo, screenNo}
        return dispatch(merge(action, {data})) // to target screen
      }
    } else {
      let preVolumnNo = volumnNo - 1
      if (preVolumnNo < 0) {
        let prePartNo = partNo - 1
        if (prePartNo < 0) {
          return dispatch(merge(action, {type: READING_FAILURE, error: 'First screen'}))
        }
        else {
          let data = {partNo: prePartNo, volumnNo: 0, screenNo: 0}
          return dispatch(merge(action, {data}))
        }
      } else {
        let data = {partNo, volumnNo: preVolumnNo, screenNo: 0}
        return dispatch(merge(action, {data})) // to pre volumn
      }
    }
  }
}
export function readNext() {
  return (dispatch, getState) => {
    let {screenNo} = getState().reading
    return dispatch(read({screenNo: screenNo + 1}))
  }
}
export function readPrevious() {
  return (dispatch, getState) => {
    let {screenNo} = getState().reading
    return dispatch(read({screenNo: screenNo - 1}))
  }
}
export function readVolumn({p, v}) {
  return (dispatch, getState) => {
    let {parts} = getState().comic.data
    let partNo = findIndex(propEq('title', p), parts)
    let {volumns} = nth(partNo, parts)
    let volumnNo = findIndex(propEq('title', v), volumns)
    let screenNo = 0
    return dispatch(read({partNo, volumnNo, screenNo}))
  }
}

export const FETCH_COMIC_REQUEST = 'FETCH_COMIC_REQUEST'
export const FETCH_COMIC_SUCCESS = 'FETCH_COMIC_SUCCESS'
export const FETCH_COMIC_FAILURE = 'FETCH_COMIC_FAILURE'
export function fetchComic(code) {
  return dispatch => {
    dispatch({type: FETCH_COMIC_REQUEST})
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
          dispatch({data, type: FETCH_COMIC_SUCCESS})
        })
        .catch(error => {
          dispatch({type: FETCH_COMIC_FAILURE})
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
        dispatch({data, type: LOAD_COMIC_SUCCESS})
      })
      .catch(error => {
        dispatch({type: LOAD_COMIC_FAILURE})
      })
  }
}
