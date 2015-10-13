import {Component} from 'react'
import Radium from 'radium'
import {compose, isNil, map, head, nth, prop, merge} from 'ramda'
import {connect} from 'react-redux'

import {readNext, readPrevious, zoomIn, zoomOut, zoomTo, enterFullscreen, exitFullscreen} from '../actions'
import Image from '../../../common/web/components/image'
import Sider from '../components/sider'
import {grid, gutters, cell, cellGutters, hcenter, u1of6} from '../styles/grid'

@connect(
  state => {
    let {isFetching} = state.comic
    let comic = state.comic.data
    let reading = state.reading
    let size = state.zoom
    let fullscreen = state.fullscreen
    return {comic, isFetching, reading, size, fullscreen}
  }
)
@Radium
export default class NowReading extends Component {

  componentDidMount() {
    this.handleKeydown.bind(this)
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  componentDidUpdate() {
    let {fullscreen} = this.props
    if (fullscreen) this.refs.reader.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
  }

  handleKeydown = (evt) => {
    const STEP = 50
    const KEY_LEFT = 37
    const KEY_RIGHT = 39
    const KEY_ESC = 27
    const KEY_PLUS = 107
    const KEY_PLUS_MICRO = 187
    const KEY_MINUS = 109
    const KEY_MINUS_MICRO = 189
    let {dispatch} = this.props
    switch(evt.keyCode) {
      case KEY_LEFT:
        dispatch(readPrevious())
        break
      case KEY_RIGHT:
        dispatch(readNext())
        break
      case KEY_ESC:
        dispatch(exitFullscreen())
        break
      case KEY_PLUS:
      case KEY_PLUS_MICRO:
        if (evt.ctrlKey) dispatch(enterFullscreen())
        else dispatch(zoomIn(STEP))
        break
      case KEY_MINUS:
      case KEY_MINUS_MICRO:
        dispatch(zoomOut(STEP))
        break
    }
  }

  render() {
    let {comic, isFetching, dispatch, size, fullscreen} = this.props
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
      return (
        <div style={[grid, gutters]}>
          <div ref="reader"
            style={[cell, cellGutters, fullscreen && styles.fullscreenBackground]}>
            <div style={[grid, hcenter]}>
            {fullscreen &&
              <img style={[styles.comic.fullscreenImg]} src={currentScreen}/>
            }
            {!fullscreen &&
              <div style={[cell]}>
                <img style={[styles.comic.img(size)]} src={currentScreen}/>
              </div>
            }
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
  comics: {

  },
  comic: {
    fullscreenImg: {
      height: window.screen.height
    },
    img: width => ({
      position: 'relative',
      left: (1280 - width) / 2,
      width
    })
  }
}
