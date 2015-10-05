import {Component, PropTypes} from 'react'
import Radium from 'radium'
import {map, compose, take} from 'ramda'

import Comics from '../components/comics'
import {comics} from '../data'
import {grid, cell, gutters, cellGutters, u1of6} from '../styles/grid'
import {spacing} from '../styles/desktop'

@Radium
export default class ComicsShelf extends Component {
  render() {
    return (
      <div>
        <div style={spacing}>
          <ComicsSearcher/>
        </div>
        <div style={[grid, gutters, spacing]}>
          <div style={[cell, cellGutters]}>
            <h3> 漫画库 </h3>
            <Comics comics={comics}/>
          </div>
          <div style={[cell, cellGutters, u1of6]}>
            <FavoriteComics comics={comics}/>
          </div>
        </div>
      </div>
    )
  }
}

@Radium
class ComicsSearcher extends Component {
  render() {
    return (
      <div style={[grid]}>
        <input style={[cell]} type='text'/>
        <button style={[cell, u1of6]}>Search</button>
      </div>
    )
  }
}

@Radium
class FavoriteComics extends Component {
  render() {
    let {comics} = this.props
    let renderComics = compose(
      map(comic => {
        return (
          <div key={comic.id}>
            <img style={{width: '100%'}} src={comic.coverImage}/>
          </div>
        )
      }),
      take(1)
    )
    return (
      <div>
        <h3> 最近浏览 </h3>
        <div>
          {renderComics(comics)}
        </div>
      </div>
    )
  }
}
