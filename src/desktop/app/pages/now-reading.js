import {Component} from 'react'
import Radium from 'radium'
import {compose, isNil, map, head, nth, prop, merge} from 'ramda'
import {connect} from 'react-redux'

import {readNext, readPrevious} from '../actions'
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
    this.refs.reader.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    this.setState({fullscreen: true})
  }

  componentDidMount() {
    this.handleKeydown.bind(this)
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = (evt) => {
    let {dispatch} = this.props
    switch(evt.keyCode) {
      case 37:
        dispatch(readPrevious())
        break
      case 39:
        dispatch(readNext())
        break
      case 27:
        this.setState({fullscreen: false})
        break
    }
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
            <h3>{title}</h3>
            <button onClick={this.enterFullscreen.bind(this)}> full screen </button>
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
          <div ref="reader"
            style={[cell, cellGutters, fullscreen && styles.fullscreenBackground]}
            onClick={nextScreen.bind(this)}>
            <div style={[grid, hcenter]}>
              <img style={[fullscreen ? styles.comic.fullscreenImg : styles.comic.img]} src={currentScreen}/>
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
