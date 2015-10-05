import {Component, PropTypes} from 'react'
import {map} from 'ramda'
import Radium, {Style} from 'radium'

import {grid, cell, gutters, cellGutters, u1of6} from '../styles/grid'

@Radium
export default class Comics extends Component {

  render() {
    let {comics} = this.props
    let renderComics = map(comic => <ComicItem key={comic.id} comic={comic}/>)
    return (
      <div style={[grid, gutters]}>
        {renderComics(comics)}
      </div>
    )
  }
}

@Radium
class ComicItem extends Component {

  render() {
    let {title, coverImage, description} = this.props.comic
    return (
      <div style={[styles.comic.item, cell, cellGutters, u1of6]}>
        <img style={[styles.comic.img]} src={coverImage}/>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    )
  }
}

let styles = {
  comics: {

  },
  comic: {
    item: {
      ':hover': {
        boxShadow: 'inset 0 0 1em gold, 0 0 1em red'
      }
    },
    img: {
      width: '100%'
    }
  }
}
