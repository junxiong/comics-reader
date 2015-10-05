import {Component, PropTypes} from 'react'

import Comics from '../components/comics'

let comics = [
  {
    title: '血族',
    coverImage: 'http://pic.huo80.com/comicui/24078.JPG',
    description: '《血族》是改编自吉尔莫·德尔·托罗和Chuck Hogan联合出版的同名小说的漫画'
  }
]

export default class Main extends Component {
  render() {
    return (
      <Comics comics={comics}/>
    )
  }
}
