import {Component, PropTypes} from 'react'

export default class Comics extends Component {
  static propTypes = {
    comics: PropTypes.array.isRequired
  }
  render() {
    let comics = this.props
    return (
      <h1> Comics </h1>
      <section>
        {comics.map(comic => <ComicItem comic={comic}/>)}
      </section>
    )
  }
}

class ComicItem extends Component {
  static propTypes = {
    comic: PropTypes.object.isRequired
  }

  render() {
    let {title, coverImage, description} = comic
    return (
      <div>
        <img src={coverImage}/>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    )
  }
}
