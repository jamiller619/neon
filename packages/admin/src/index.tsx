import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '~/app'

const el = document.getElementById('root') as HTMLElement

const root = createRoot(el)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
