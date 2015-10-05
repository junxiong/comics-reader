import app from 'app'
import BrowserWindow from 'browser-window'
import CrashReporter from 'crash-reporter'

let mainWindow = null;

app.on('window-all-closed', evt => {
  if (process.plaftorm !== 'darwin') app.quit()
})

app.on('ready', evt => {
  let index = `file://${__dirname}/www/index.html`
  mainWindow = new BrowserWindow({width: 1280, height: 720, center: true})
  mainWindow.loadUrl(index)
  mainWindow.openDevTools()
  mainWindow.on('closed', evt => mainWindow = null)
})
