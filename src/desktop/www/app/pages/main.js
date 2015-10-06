import {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'

import {pushState} from '../actions'
import Header from '../components/header'
import Bookshelf from './book-shelf'
import Booklibrary from './book-library'

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
    return (
      <div>
        <Header route={route} items={items} onItemClick={handleItemClick}/>
        <div style={[styles.content, spacing]}>
          {route === 'bookshelf' &&
            <Bookshelf/>
          }
          {route === 'booklibrary' &&
            <Booklibrary/>
          }
        </div>
      </div>
    )
  }
}

let items = [
  {label: '漫画架', route: 'bookshelf'},
  {label: '漫画库', route: 'booklibrary'}
]

let styles = {
  content: {
    marginTop: Spacing
  }
}
