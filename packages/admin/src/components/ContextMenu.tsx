import { ContextMenu as RUIContextMenu, colorProp } from '@radix-ui/themes'
import { Fragment, ReactNode, useId } from 'react'
import styled from 'styled-components'

export type ContextMenuItem =
  | 'separator'
  | {
      text: string
      color?: (typeof colorProp)['values'][number]
      shortcut?: string
      action?: () => void
      icon?: ReactNode
      children?: ContextMenuItem[]
    }

export type ContextMenuProps = {
  children?: ReactNode
  content?: ContextMenuItem[]
}

const Content = styled(RUIContextMenu.Content)`
  .rt-BaseMenuItem {
    justify-content: start;
    gap: var(--space-2);
  }
`

export default function ContextMenu({ children, content }: ContextMenuProps) {
  const id = useId()

  return (
    <RUIContextMenu.Root>
      <RUIContextMenu.Trigger>{children}</RUIContextMenu.Trigger>
      <Content>
        {content?.map((item, i) =>
          typeof item === 'string' && item === 'separator' ? (
            <RUIContextMenu.Separator key={`${id}-${i}`} />
          ) : (
            <Fragment key={`${id}-${i}`}>
              {item.children ? (
                <RUIContextMenu.Sub>
                  <RUIContextMenu.SubTrigger>
                    {item.text}
                  </RUIContextMenu.SubTrigger>
                  <RUIContextMenu.SubContent>
                    {item.children.map((child, n) =>
                      child === 'separator' ? (
                        <RUIContextMenu.Separator key={`${id}-${i}-${n}`} />
                      ) : (
                        <RUIContextMenu.Item
                          key={`${id}-${i}-${n}`}
                          shortcut={child.shortcut}>
                          {child.icon}
                          {child.text}
                        </RUIContextMenu.Item>
                      ),
                    )}
                  </RUIContextMenu.SubContent>
                </RUIContextMenu.Sub>
              ) : (
                <RUIContextMenu.Item
                  shortcut={item.shortcut}
                  color={item.color}>
                  {item.icon}
                  {item.text}
                </RUIContextMenu.Item>
              )}
            </Fragment>
          ),
        )}
      </Content>
    </RUIContextMenu.Root>
  )
}
