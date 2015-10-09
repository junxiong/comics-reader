import {Component} from 'react'
import Radium from 'radium'
import {compose, isNil, map, head, nth, prop} from 'ramda'
import {connect} from 'react-redux'

import {readNext} from '../actions'
import {grid, gutters, cell, cellGutters, u1of6} from '../styles/grid'

@connect(
  state => {
    let {isFetching} = state.comic
    let comic = state.comic.data
    let reading = state.reading
    return {comic, isFetching, reading}
  }
)
@Radium
export default class NowReading extends Component {

  render() {
    let {comic, isFetching, dispatch} = this.props
    if (isFetching) return <div style={[grid, gutters]}> 稍等，正在调出漫画.... </div>
    else if (isNil(this.props.comic)) return <div style={[grid, gutters]}> 找本漫画看看吧 </div>
    else {
      let {id, code, title, coverImage, author, description, parts} = this.props.comic
      let {partNo, volumnNo, screenNo} = this.props.reading
      let currentPart = nth(partNo, parts)
      let {volumns} = currentPart
      let currentVolumn = nth(volumnNo, volumns)
      let {screens} = currentVolumn
      let currentScreen = screens[screenNo]
      let nextScreen = () => dispatch(readNext())
      return (
        <div style={[grid, gutters]}>
          <div style={[cell, cellGutters, u1of6]}>
            <img style={[styles.comic.img]} src={coverImage}/>
            <h3>{title}</h3>
            <p>{description}</p>
            <div style={[styles.list]}>
              {map(({title}) => <div
                style={[styles.listItem,
                  currentPart.title === title && styles.active]}
                key={title}><p>{title}</p></div>)(parts)}
            </div>
          </div>
          <div style={[cell, cellGutters]}>
            <img style={[styles.comic.img]} src={currentScreen} onClick={nextScreen.bind(this)}/>
          </div>
          <div style={[cell, cellGutters, u1of6]}>
            <div style={[styles.list]}>
              {map(({title}) => <div
                style={[styles.listItem,
                  title === currentVolumn.title && styles.active]}
                key={title}>{title}</div>, volumns)}
            </div>
          </div>
        </div>
      )
    }
  }
}

let styles = {
  list: {
  },
  listItem: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
    background: '#00BCD4'
  },
  active: {
    borderBottom: '2px solid red'
  },
  comics: {

  },
  comic: {
    img: {
      width: '100%'
    }
  }
}
