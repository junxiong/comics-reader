import {Component} from 'react'
import Radium from 'radium'

import {grid, center, cell, u1of6} from '../styles/grid'

@Radium
export default class ComicsSearcher extends Component {
  render() {
    return (
      <div style={[grid, center]}>
        <div style={[cell]}/>
        <input style={[cell]} type='text'/>
        <button style={[cell, u1of6]}>Search</button>
        <div style={[cell]}/>
      </div>
    )
  }
}
