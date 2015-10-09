import {Component, PropTypes} from 'react'
import Radium from 'radium'
import {map, compose, take, isEmpty} from 'ramda'
import {connect} from 'react-redux'

import {searchComics, loadBookshelf} from '../actions'
import Comics from '../components/comics'
import FavoriteComics from '../components/favorites'

import {grid, center, cell, gutters, cellGutters, u1of3, u1of6} from '../styles/grid'

@connect(
  state => ({
    isLoading: state.bookshelf.isLoading,
    comics: state.bookshelf.data
  })
)
@Radium
export default class ComicsShelf extends Component {

  componentWillMount() {
    this.props.dispatch(loadBookshelf())
  }

  render() {
    let {comics, isFetching, query, onReadingComic} = this.props
    return (
      <div style={[grid, gutters]}>
        <div style={[cell, cellGutters]}>
          <Comics comics={comics} onReadingComic={onReadingComic}/>
        </div>
        <div style={[cell, cellGutters, u1of6]}>
          <FavoriteComics comics={comics}/>
        </div>
      </div>
    )
  }
}
