import {Component, PropTypes} from 'react'
import {compose, map, isEmpty, filter, complement} from 'ramda'
import Radium, {Style} from 'radium'

import Image from '../../../common/web/components/image'
import {matrixfy, Seq} from '../../../common/isomorphic/utils'
import {grid, cell, gutters, cellGutters, u1of6} from '../styles/grid'

@Radium
export default class Comics extends Component {

  render() {
    let next = Seq()
    let {comics, onReadingComic} = this.props
    let renderComic = comic => {
      return <ComicItem
        key={comic.id || comic.code}
        comic={comic}
        onReadingComic={onReadingComic}/>
    }
    let renderColumn = column => (
      <div key={next()} style={[cell, cellGutters]}>
        {map(renderComic, column)}
      </div>
    )
    let rendComics = comics => {
      return (
        <div style={[grid, gutters]}>
        {compose(
            map(renderColumn),
            map(filter(complement(isEmpty))),
            matrixfy(8),
          )(comics)
        }
        </div>
      )

    }
    let isComicsEmpty = isEmpty(comics)
    return (
      <div>
        {isComicsEmpty &&
          <div> </div>
        }
        {!isComicsEmpty &&
          rendComics(comics)
        }
      </div>
    )
  }
}

@Radium
class ComicItem extends Component {

  render() {
    let {onReadingComic} = this.props
    let {id, code, title, coverImage, author} = this.props.comic
    let c = {id, code}
    return (
      <div
        onClick={onReadingComic.bind(this, c)}
        style={[styles.comic.item]}>
        <Image style={[styles.comic.img]} src={coverImage} alt={code}/>
        <p>{title}</p>
        <p>{author}</p>
      </div>
    )
  }
}

let styles = {
  comics: {

  },
  comic: {
    item: {
      cursor: 'pointer',
      borderRadius: 10,
      backgroundColor: '#FF5722',
      ':hover': {
        boxShadow: 'inset 0 0 1em gold, 0 0 1em red'
      }
    },
    img: {
      width: '100%'
    }
  }
}
