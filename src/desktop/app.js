import app from 'app'
import BrowserWindow from 'browser-window'
import CrashReporter from 'crash-reporter'

let mainWindow = null;

app.on('window-all-closed', evt => {
  if (process.plaftorm !== 'darwin') app.quit()
})

app.on('ready', evt => {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadUrl(`file://${__dirname}/index.html`)
  mainWindow.openDevTools()
  mainWindow.on('closed', evt => mainWindow = null)
})
