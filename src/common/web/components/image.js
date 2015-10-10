import {Component} from 'react'
import Radium from 'radium'

@Radium
export default class ImageLoader extends Component {
  initialState = {
    loaded: false,
    failed: false
  }

  render() {
    let {loaded, failed} = this.state
    let {src, style, alt} = this.props
    //let failedSrc = `http://place-hold.it/300x400/FF8A65/fff/000&text=${alt}&fontsize=23`
    let loadingSrc = 'images/loading.gif'
    let failedSrc = 'images/failed.gif'
    if (loaded) return <img style={[style, styles.imageLoaded]} src={src}/>
    else if (failed) return <img style={[style, styles.imageLoaded]} src={failedSrc}/>
    else return <img style={[style, styles.image]} src={loadingSrc}/>
  }

  componentDidMount() {
    let img = new Image()
    let handleLoad = evt => this.setState({loaded: true})
    let handleFalied = evt => this.setState({failed: true})
    img.onload = handleLoad.bind(this)
    img.onerror = handleFalied.bind(this)
    img.src = this.props.src
  }
}

let styles = {
  image: {
    opacity: 0.5,
    transition: 'opacity 1.0s ease'
  },
  imageLoaded: {
    opacity: 1
  }
}
