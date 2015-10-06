import {Component, PropTypes} from 'react'
import Radium from 'radium'
import {map, compose, take, isEmpty} from 'ramda'
import {connect} from 'react-redux'

import {searchComics} from '../actions'
import Comics from '../components/comics'
import ComicsSearcher from '../components/searcher'

import {grid, center, cell, gutters, cellGutters, u1of3, u1of6} from '../styles/grid'

@connect(
  state => ({
    query: state.library.query,
    isSearching: state.library.isSearching,
    comics: state.library.data
  })
)
@Radium
export default class ComicsLibrary extends Component {

  componentWillMount() {
    this.props.dispatch(searchComics(''))
  }

  render() {
    let {comics, isFetching, query} = this.props
    return (
      <div>
        <ComicsSearcher query={query}/>
        <div style={{height: 20}}/>
        <Comics comics={comics}/>
      </div>
    )
  }
}
