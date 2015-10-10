import {Component} from 'react'
import Radium from 'radium'
import {map} from 'ramda'

import {Spacing} from '../styles/desktop'
import {grid, center, gutters, cell, cellGutters, cellCenter, u1of6} from '../styles/grid'

@Radium
export default class Header extends Component {

  render() {
    let {route, items, onItemClick} = this.props
    let renderItems = map(item => (
      <div
        key={item.route}
        onClick={onItemClick.bind(this, item.route)}
        style={[
          styles.item,
          cell,
          u1of6,
          route === item.route && styles.active]}>
        <h3>{item.label}</h3>
      </div>
    ))
    return (
      <div style={[grid, center, styles.header]}>
        <div style={[cell]}/>
        {renderItems(items)}
        <div style={[cell]}/>
      </div>
    )
  }
}

let styles = {
  active: {
    borderBottom: '2px solid #2196F3'
  },
  item: {
    height: '100%',
    cursor: 'pointer'
  },
  header: {
    color: 'white',
    textAlign: 'center',
    boxSshadow: '0 2px 5px rgba(0,0,0,0.26)',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    position: 'fixed',
    backgroundColor: '#FF5722'
  }
}
