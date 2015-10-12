import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'
import {isNil} from 'ramda'

import {pushState, fetchComic, loadComic, showSider, hideSider, readVolumn} from '../actions'
import Header from '../components/header'
import Bookshelf from './book-shelf'
import Booklibrary from './book-library'
import NowReading from './now-reading'

import {Spacing, spacing} from '../styles/desktop'
import Sider from '../components/sider'
import {grid, gutters, cell, cellGutters, hcenter, u1of6} from '../styles/grid'

@connect(
  state => {
    let {route} = state
    let {isFetching} = state.comic
    let comic = state.comic.data
    let reading = state.reading
    let sider = state.sider
    return {route, comic, isFetching, reading, sider}
  }
)
@Radium
export default class Main extends Component {

  render() {
    let {route, dispatch, comic, reading, sider} = this.props
    let handleItemClick = route => dispatch(pushState(route))
    let handleReadComic = ({id, code}) => {
      if (!isNil(id)) dispatch(loadComic(id))
      else if(!isNil(code)) dispatch(fetchComic(code))
      else return
      dispatch(pushState('nowreading'))
    }
    let handleShowSider = evt => dispatch(showSider())
    let handleHideSider = evt => dispatch(hideSider())
    let isReading = route === 'nowreading' && !isNil(comic)
    let showSiderIcon = isReading ? <img style={{cursor: 'pointer'}} src='images/ic_reorder_white_48dp_1x.png' onClick={handleShowSider.bind(this)}/> : null
    let hideSiderIcon = <img style={{cursor: 'pointer'}} src='images/ic_reorder_white_48dp_1x.png' onClick={handleHideSider.bind(this)}/>
    let handleViewVolumn = target => {
      dispatch(readVolumn(target))
      dispatch(hideSider())
    }
    return (
      <div>
        {isReading && sider &&
          <Sider comic={comic} reading={reading} icon={hideSiderIcon} onViewVolumn={handleViewVolumn}/>
        }
        <div>
          <Header route={route} items={items} onItemClick={handleItemClick} icon={showSiderIcon}/>
          <div style={[styles.content]}>
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
