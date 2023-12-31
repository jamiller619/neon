import { Dialog } from '@radix-ui/themes'
import { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
}

export default function Modal({ children }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content></Dialog.Content>
    </Dialog.Root>
  )
}
