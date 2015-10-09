/**
  Highlevel overview of the structure of the store
  type Store {
    bookshelf: Bookshelf,
    library: Library,
    favorites: Favorites
    comic: Comic
    volumn: Volumn
  }

  type Bookshelf {
    isLoading: false
    data: [ComicType]
  }

  type Library {
    query: String,
    isSearching: Boolean,
    data: [ComicType]
  }

  type Favorites {
    data: [ComicType]
  }

  type Comic {
    request: {String, String},
    isFetching: String,
    data: ComicType,
    volumn: Volumn
  }

  type Volumn {
    partNo: Int,
    volumnNo: Int,
    screenNo: Int
  }
*/
import {merge} from 'ramda'
import {combineReducers} from 'redux'

import {
  PUSH_STATE,
  READING_SUCCESS,
  READING_FAILURE,
  LOAD_BOOK_SHELF_REQUEST,
  LOAD_BOOK_SHELF_SUCCESS,
  LOAD_BOOK_SHELF_FAILURE,
  SEARCH_COMICS_REQUEST,
  SEARCH_COMICS_SUCCESS,
  SEARCH_COMICS_FAILURE,
  FETCH_COMIC_REQUEST,
  FETCH_COMIC_SUCCESS,
  FETCH_COMIC_FAILURE
} from '../actions'

export function route(state='bookshelf', action) {
  let {route, type} = action
  if (type === PUSH_STATE) return route
  else return state
}
export function bookshelf(state = {
  isLoading: false,
  data: []
}, action) {
  let {type, data} = action
  switch(action.type) {
    case LOAD_BOOK_SHELF_REQUEST:
      return merge(state, {isLoading: true})
    case LOAD_BOOK_SHELF_SUCCESS:
      return merge(state, {data, isLoading: false})
    case LOAD_BOOK_SHELF_FAILURE:
      return merge(state, {isLoading: false})
    default: return state
  }
}

export function library(state = {
  query: '',
  isSearching: false,
  data: []
}, action) {
  let {type, query, data} = action
  switch(action.type) {
    case SEARCH_COMICS_REQUEST:
      return merge(state, {query, isSearching: true})
    case SEARCH_COMICS_SUCCESS:
      return merge(state, {query, data, isSearching: false})
    case SEARCH_COMICS_FAILURE:
      return merge(state, {query, isSearching: false})
    default: return state
  }
}

export function comic(state = {
  request: null,
  isFetching: false,
  data: null
}, action) {
  let {type, request, data} = action
  switch(type) {
    case FETCH_COMIC_REQUEST:
      return merge(state, {request, isFetching: true})
    case FETCH_COMIC_SUCCESS:
      return merge(state, {request, data, isFetching: false})
    case FETCH_COMIC_FAILURE:
      return merge(state, {request, isFetching: false})
    default: return state
  }
}

export function reading(state = {
  partNo: 0,
  volumnNo: 0,
  screenNo: 0
}, action) {
  let {data, type} = action
  switch (type) {
    case READING_SUCCESS:
      return merge(state, data)
    case READING_FAILURE:
      return state
    default: return state

  }
}

export default combineReducers({route, bookshelf, library, comic, reading})