import {Component} from 'react'
import Radium from 'radium'
import {map, nth, merge} from 'ramda'

import Image from '../../../common/web/components/image'
import {grid, center, cell, gutters, cellGutters, u1of3, u1of6} from '../styles/grid'

@Radium
export default class Sider extends Component {

  render() {
    let {id, code, title, coverImage, author, description, parts} = this.props.comic
    let {partNo, volumnNo, screenNo} = this.props.reading
    let currentPart = nth(partNo, parts)
    let {volumns} = currentPart
    let currentVolumn = nth(volumnNo, volumns)
    return (
      <div style={[cell, u1of6, cellGutters,styles.sider('L')]}>
        <h3>{title}</h3>
        <Image style={[styles.comic.img]} src={coverImage}/>
        <p>{description}</p>
        <div style={[styles.list]}>
          {
            map(p => (
              <div
                style={[styles.listItem]}
                key={p.title}>
                <p style={[styles.part,
                  currentPart.title === p.title && styles.active]}>
                  {p.title}
                </p>
                <div style={[styles.list]}>
                  {
                    map(v => (
                      <div
                        style={[styles.listItem]}
                        key={v.title}>
                        <p style={[styles.volumn,
                          v.title === currentVolumn.title && currentPart.title === p.title && styles.active]}>
                          {v.title}
                        </p>
                      </div>), volumns)
                    }
                </div>
              </div>)
            )(parts)
          }
        </div>
      </div>
    )
  }
}

let styles = {
  sider: direction => {
    let shadow = {
      backgroundColor: '#FF5722'
    }
    switch(direction) {
      case 'L':
        return merge(shadow, {boxShadow: '1px 0px 1px 0px rgba(33,150,243,1)'})
      case 'R':
        return merge(shadow, {boxShadow: '-1px 0px 1px 0px rgba(33,150,243,1)'})
      default: throw 'Not supported'
    }
  },
  part: {
    parding: 0,
    backgroundColor: '#BF360C',
    fontSize: 24,
    height: 32
  },
  volumn: {
    padding: 0,
    backgroundColor: '#BF360C',
    fontSize: 24,
    height: 32
  },
  list: {
  },
  listItem: {
    color: 'white',
    width: '100%',
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
