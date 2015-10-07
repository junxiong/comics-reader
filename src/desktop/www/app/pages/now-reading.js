import {Component} from 'react'

import {grid, gutters, cell, cellGutters, u1of6} from '../styles/grid'

export default class NowReading extends Component {

  render() {
    return (
      <div style={[grid, gutters]}>
        <div style={[cell, cellGutters]}>
          <div>reading</div>
        </div>
        <div style={[cell, cellGutters, u1of6]}>
          <div>volumns</div>
        </div>
      </div>
    )
  }
}
