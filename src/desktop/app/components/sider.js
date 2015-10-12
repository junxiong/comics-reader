import {Component} from 'react'
import Radium from 'radium'
import {map, nth, merge, flatten, compose, filter, complement, isEmpty} from 'ramda'

import {matrixfy} from '../../../common/isomorphic/utils'
import Image from '../../../common/web/components/image'
import {grid, center, cell, gutters, cellGutters, u1of3, u1of6, wrap} from '../styles/grid'

@Radium
export default class Sider extends Component {

  render() {
    let {id, code, title, coverImage, author, description, parts} = this.props.comic
    let {partNo, volumnNo, screenNo} = this.props.reading
    let currentPart = nth(partNo, parts)
    let {volumns} = currentPart
    let currentVolumn = nth(volumnNo, volumns)
    let titles = flatten(map(part => map(volumn => {
      let p = part.title
      let v = volumn.title
      return {p, v}
    }, part.volumns) ,parts))
    let Seq = () => {
      let i = 0
      return () => {
        i = i + 1
        return i
      }
    }
    let renderTitle = ({p, v}) => (
      <div key={p+v} style={[styles.volumn,
        v === currentVolumn.title && p ===currentPart.title && styles.active]}>
        <p>{p+v}</p>
      </div>
    )
    let next = Seq()
    let renderColumn = (column) => (
      <div key={next()} style={[cell, cellGutters]}>
        {map(renderTitle, column)}
      </div>
    )
    return (
      <div style={[styles.sider('L')]}>
        <div style={[grid]}>
          <div style={[cell]}><h3>{title}</h3></div>
          <div style={[cell, styles.icon]}>{this.props.icon}</div>
        </div>
        <div style={[grid]}>
          <div style={[cell, styles.img]}><Image style={[styles.comic.img]} src={coverImage}/></div>
          <div style={[cell]}><p style={[styles.description]}>{description}</p></div>
        </div>
        <div style={[grid, gutters, wrap]}>
          {
            compose(
              map(renderColumn),
              map(filter(complement(isEmpty))),
              matrixfy(6),
            )(titles)
          }
        </div>
      </div>
    )
  }
}

let styles = {
  description: {
    paddingTop: 0,
    marginTop: 0
  },
  img: {
    flex: 'none',
    width: 80
  },
  icon: {
    width: 50,
    flex: 'none'
  },
  sider: direction => {
    let sider = {
      position: 'fixed',
      left: 0,
      top: 0,
      height: screen.height,
      paddingTop: 0,
      marginTop: 0,
      zIndex: 999,
      width: 800,
      backgroundColor: '#FF5722'
    }
    switch(direction) {
      case 'L':
        return merge(sider, {boxShadow: '2px 0px 5px 0px rgba(0,0,0,0.26)'})
      case 'R':
        return merge(sider, {boxShadow: '-2px 0px 5px 0px rgba(0,0,0,0.26)'})
      default: throw 'Not supported'
    }
  },
  volumn: {
    backgroundColor: '#FF5722',
    fontSize: 16,
    textAlign: 'center'
  },
  active: {
    backgroundColor: '#2196F3'
  },
  comic: {
    img: {
      width: '100%'
    }
  }
}
