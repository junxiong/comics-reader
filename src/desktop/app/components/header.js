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
        <h2>{item.label}</h2>
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
    borderBottom: '2px solid red'
  },
  item: {
    height: '100%',
    cursor: 'pointer'
  },
  header: {
    color: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
    height: Spacing,
    textAlign: 'center',
    background: '#00BCD4'
  }
}
