import {Component} from 'react'
import Radium from 'radium'
import {compose, isNil, map, head, nth, prop, merge} from 'ramda'
import {connect} from 'react-redux'

import {readNext} from '../actions'
import Image from '../../../common/web/components/image'
import {grid, gutters, cell, cellGutters, hcenter, u1of6} from '../styles/grid'

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

  initialState = {
    fullscreen: false
  }

  enterFullscreen() {
    this.refs.reader.webkitRequestFullscreen()
    this.setState({fullscreen: true})
  }

  render() {
    let {fullscreen} = this.state
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
          <div style={[cell, u1of6, cellGutters, styles.sider('L')]}>
            <Image style={[styles.comic.img]} src={coverImage}/>
            <h3>{title}</h3>
            <p>{description}</p>
            <div style={[styles.list]}>
              {map(({title}) => <div
                style={[styles.listItem]}
                key={title}><p style={[styles.part,
                  currentPart.title === title && styles.active]}>{title}</p></div>)(parts)}
            </div>
          </div>
          <div style={[cell, cellGutters]}>
            <div ref="reader" style={[grid, hcenter, fullscreen && styles.fullscreenBackground]} onClick={nextScreen.bind(this)}>
              <img style={[fullscreen ? styles.comic.fullscreenImg : styles.comic.img]} src={currentScreen}/>
            </div>
          </div>
          <div style={[cell, u1of6, cellGutters, styles.sider('R')]}>
            <button onClick={this.enterFullscreen.bind(this)}> full screen </button>
            <div style={[styles.list]}>
              {map(({title}) => <div
                style={[styles.listItem]}
                key={title}><p style={[styles.volumn,
                  title === currentVolumn.title && styles.active]}>{title}</p></div>, volumns)}
            </div>
          </div>
        </div>
      )
    }
  }

}

let styles = {
  fullscreenBackground: {
    backgroundColor: 'black'
  },
  sider: direction => {
    let shadow = {backgroundColor: '#FF5722'}
    switch(direction) {
      case 'L':
        return merge(shadow, {boxShadow: '1px 0px 1px 0px rgba(33,150,243,1)'})
      case 'R':
        return merge(shadow, {boxShadow: '-1px 0px 1px 0px rgba(33,150,243,1)'})
      default: throw 'Not supported'
    }
  },
  part: {
    backgroundColor: '#BF360C',
    fontSize: 24,
    height: 32
  },
  volumn: {
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
  comics: {

  },
  comic: {
    fullscreenImg: {
      height: window.screen.height
    },
    img: {
      width: '100%'
    }
  }
}
