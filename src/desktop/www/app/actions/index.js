import {merge, append, fileter, propEq, isNil, find, findIndex} from 'ramda'

import * as store from '../data'
import * as remote from '../../../../comic'

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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(store.comics)
      }, 100)
    })
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
    let {volumns} = comic.data
    let volumnsInPart = volumns[partNo][1]
    let {screens} = volumnsInPart[volumnNo]
    let data = {partNo, volumnNo, screenNo}
    let nextVolumnNo = volumnNo + 1
    let nextPartNo = partNo + 1
    if (screenNo > 0 || screenNo < screens.length) return dispatch(merge(action, {data}))
    else if (nextVolumnNo < volumnsInPart.length) return dispatch(merge(action, {data}, {volumnNo: nextVolumnNo, screenNo: 0}))
    else if (nextPartNo < volumns.length) return dispatch(merge(action, {data}, {partNo: nextPartNo, volumnNo: 0, screenNo: 0}))
    else return dispatch(merge(action, {type: READING_FAILURE}))
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
export function fetchComic(request) {
  let {id, code} = request
  let action = {request}
  return dispatch => {
    dispatch(merge(action, {isFetching: true, type: FETCH_COMIC_REQUEST}))
    if(isNil(id)) {
      return remote.fetchComic(code)
        .then(data => dispatch(merge(action, {data, isFetching: false, type: FETCH_COMIC_SUCCESS})))
        .catch(error => dispatch(merge(action, {isFetching: false, type: FETCH_COMIC_FAILURE})))
    } else {
      return remote.fetchComic(code)
        .then(data => dispatch(merge(action, {data, isFetching: false, type: FETCH_COMIC_SUCCESS})))
        .catch(error => dispatch(merge(action, {isFetching: false, type: FETCH_COMIC_FAILURE})))
    }
  }
}
