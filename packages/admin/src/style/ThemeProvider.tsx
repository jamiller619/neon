import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { ReactNode } from 'react'
import './theme.css'

type ThemeProviderProps = {
  children?: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <Theme
      appearance="dark"
      grayColor="slate"
      accentColor="indigo"
      radius="full">
      {children}
    </Theme>
  )
}
