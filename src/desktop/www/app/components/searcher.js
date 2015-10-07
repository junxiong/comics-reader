import {Component} from 'react'
import Radium from 'radium'

import {grid, center, cell, u1of6} from '../styles/grid'

@Radium
export default class ComicsSearcher extends Component {

  render() {
    return (
      <div style={[grid, center]}>
        <div style={[cell]}/>
        <input
          ref='search'
          style={[cell]}
          type='text'
          onChange={this.handleSearch.bind(this)}/>
        <button
          style={[cell, u1of6]}
          onClick={this.handleSearch.bind(this)}>
          Search
        </button>
        <div style={[cell]}/>
      </div>
    )
  }

  handleSearch() {
    let {onSearch} = this.props
    onSearch(this.refs.search.value)
  }
}
