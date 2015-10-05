import {Component, PropTypes} from 'react'

import Comics from '../components/comics'
import {comics} from '../data'

export default class ComicsShelf extends Component {
  render() {
    return (
      <Comics comics={comics}/>
    )
  }
}
