import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, Rectangle, Tray, app, nativeImage } from 'electron'
import logger from 'logger'
import playIcon from '~/assets/play-icon.png'
import { IS_DEV } from '~/config/constants'
import trayFilePath from './tray.html'

const log = logger('tray.service')

app.dock?.hide()

log.info(`Starting tray.service`)

app.whenReady().then(async () => {
  const win = await createWindow()

  createTray(win)
})

async function createWindow() {
  const win = new BrowserWindow({
    width: 250,
    height: 310,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
  })

  const dir = fileURLToPath(new URL('.', import.meta.url))
  const filePath = path.join(dir, trayFilePath)

  log.info(`Using tray HTML file: "${filePath}"`)

  await win.loadFile(filePath)

  if (IS_DEV) {
    win.webContents.openDevTools({
      mode: 'detach',
    })
  }

  const handleBlur = () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  }

  win.on('blur', handleBlur)

  return win
}

function createTray(win: BrowserWindow) {
  const iconPath = path.resolve('dist', playIcon)
  const icon = nativeImage.createFromPath(iconPath)
  const tray = new Tray(icon)

  tray.setToolTip('neon media server')
  tray.setTitle('neon media server')

  tray.on('click', () => toggleWindow(win, tray))

  return tray
}

function resolveY(trayBounds: Rectangle, windowBounds: Rectangle) {
  if (process.platform === 'win32') {
    return Math.round(trayBounds.y - trayBounds.height * 4)
  }

  return Math.round(trayBounds.y + trayBounds.height + 3)
}

function getWindowPosition(win: BrowserWindow, tray: Tray) {
  const windowBounds = win.getNormalBounds()
  const trayBounds = tray.getBounds()

  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
  )

  console.log('windowBounds', windowBounds)
  console.log('trayBounds', trayBounds)

  // Position window 4 pixels vertically below the tray icon
  const y = resolveY(trayBounds, windowBounds)

  return { x, y }
}

function showWindow(win: BrowserWindow, tray: Tray) {
  const pos = getWindowPosition(win, tray)

  win.setPosition(pos.x, pos.y, false)
  win.show()
  win.focus()
}

const isVisibleRef = {
  current: false,
}

function toggleWindow(win: BrowserWindow, tray: Tray) {
  if (isVisibleRef.current) {
    win.hide()
  } else {
    showWindow(win, tray)
  }

  isVisibleRef.current = !isVisibleRef.current
}
