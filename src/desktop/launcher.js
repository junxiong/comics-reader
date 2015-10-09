import path from 'path'
import app from 'app'
import BrowserWindow from 'browser-window'
import CrashReporter from 'crash-reporter'

let mainWindow = null;

app.on('window-all-closed', evt => {
  if (process.plaftorm !== 'darwin') app.quit()
})

app.on('ready', evt => {
  let index = `file://${__dirname}/www/index.html`
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'images/cover.jpg'),
    width: 1280,
    height: 960,
    center: true,
    resizable: false,
    'dark-theme': true,
    'auto-hide-menu-bar': true
  })
  mainWindow.loadUrl(index)
  mainWindow.on('closed', evt => mainWindow = null)
})
