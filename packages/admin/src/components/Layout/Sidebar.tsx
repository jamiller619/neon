import { Navigation20Filled as Icon } from '@fluentui/react-icons'
import { IconButton } from '@radix-ui/themes'
import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import Logo from '~/components/Logo'
import Panel from '~/components/Panel'

type SidebarProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean
  setOpen: (open: boolean) => void
  children?: ReactNode
}

const Container = styled(Panel.Flex)<{ $isOpen: boolean }>`
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-2);
  color: var(--gray-a10);
`

const ToggleButton = styled(IconButton)`
  cursor: pointer;
`

export default function Sidebar({
  open,
  setOpen,
  children,
  ...props
}: SidebarProps) {
  return (
    <Container $isOpen={open} {...props}>
      <Logo />
      <ToggleButton onClick={() => setOpen(!open)}>
        <Icon />
      </ToggleButton>
      {children}
    </Container>
  )
}
