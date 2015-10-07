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
      let {id, code, title, coverImage, description, volumns} = this.props.comic
      let parts = map(head, volumns)
      let {partNo, volumnNo, screenNo} = this.props.reading
      let volumnsInPart = volumns[partNo][1]
      let {screens} = volumnsInPart[volumnNo]
      let screen = screens[screenNo]
      let nextScreen = () => dispatch(readNext())
      return (
        <div style={[grid, gutters]}>
          <div style={[cell, cellGutters, u1of6]}>
            <img style={[styles.comic.img]} src={coverImage}/>
            <h3>{title}</h3>
            <p>{description}</p>
            <ol>
              {map(part => <li key={part}><p>{part}</p></li>)(parts)}
            </ol>
          </div>
          <div style={[cell, cellGutters]}>
            <img style={[styles.comic.img]} src={screen} onClick={nextScreen.bind(this)}/>
          </div>
          <div style={[cell, cellGutters, u1of6]}>
            <ol>
              {map(({title}) => <li key={title}>{title}</li>, volumnsInPart)}
            </ol>
          </div>
        </div>
      )
    }
  }
}

let styles = {
  comics: {

  },
  comic: {
    img: {
      width: '100%'
    }
  }
}
