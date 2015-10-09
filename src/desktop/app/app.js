import Dom from 'react-dom'
import {Provider} from 'react-redux'

import Main from './pages/main'
import configStore from './store'

let store = configStore()

export default function App(root) {
  Dom.render((
    <Provider store={store}>
      <Main/>
    </Provider>
  ), root)
}
