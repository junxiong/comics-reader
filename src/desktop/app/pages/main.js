import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'
import {isNil} from 'ramda'

import {pushState, fetchComic, loadComic} from '../actions'
import Header from '../components/header'
import Bookshelf from './book-shelf'
import Booklibrary from './book-library'
import NowReading from './now-reading'

import {Spacing, spacing} from '../styles/desktop'

@connect(
  state => {
    let {route} = state
    return {route}
  }
)
@Radium
export default class Main extends Component {
  render() {
    let {route, dispatch} = this.props
    let handleItemClick = route => dispatch(pushState(route))
    let handleReadComic = ({id, code}) => {
      if (!isNil(id)) dispatch(loadComic(id))
      else if(!isNil(code)) dispatch(fetchComic(code))
      else return
      dispatch(pushState('nowreading'))
    }
    return (
      <div>
        <Header route={route} items={items} onItemClick={handleItemClick}/>
        <div style={[styles.content, spacing]}>
          {route === 'bookshelf' &&
            <Bookshelf onReadingComic={handleReadComic}/>
          }
          {route === 'booklibrary' &&
            <Booklibrary onReadingComic={handleReadComic}/>
          }
          {route === 'nowreading' &&
            <NowReading/>
          }
        </div>
      </div>
    )
  }
}

let items = [
  {label: '阅读中', route: 'nowreading'},
  {label: '漫画书架', route: 'bookshelf'},
  {label: '在线漫画库', route: 'booklibrary'}
]

let styles = {
  content: {
    marginTop: Spacing
  }
}
