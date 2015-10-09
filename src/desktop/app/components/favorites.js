import {Component} from 'react'
import Radium from 'radium'
import {compose, map, take, isEmpty} from 'ramda'

@Radium
export default class FavoriteComics extends Component {
  render() {
    let {comics} = this.props
    let renderComics = compose(
      map(comic => {
        return (
          <div key={comic.id}>
            <img style={{width: '100%'}} src={comic.coverImage}/>
          </div>
        )
      }),
      take(1)
    )
    return (
      <div>
        <div>
          {!isEmpty(comics) ? renderComics(comics) : <div> 没有记录 </div>}
        </div>
      </div>
    )
  }
}
