import {
  Delete16Regular as DeleteIcon,
  ArrowDownload16Regular as DownloadIcon,
  Wrench16Regular as FixIcon,
  Play16Regular as PlayIcon,
  TextBulletList16Regular as PlaylistIcon,
  ArrowSync16Regular as RefreshIcon,
} from '@fluentui/react-icons'
import { ReactNode } from 'react'
import { MediaType } from '@neon/shared/enums'
import ContextMenu, { ContextMenuItem } from '~/components/ContextMenu'

type CardContextMenuProps = {
  children: ReactNode
  mediaType: MediaType
}

type Menu = {
  [K in MediaType]: ContextMenuItem[]
} & {
  common: {
    footer: ContextMenuItem[]
  }
}

const menu: Menu = {
  common: {
    footer: [
      'separator',
      {
        text: 'Download',
        icon: <DownloadIcon />,
      },
      {
        text: 'Delete',
        color: 'red',
        icon: <DeleteIcon />,
      },
    ],
  },
  application: [],
  font: [],
  model: [],
  text: [],
  image: [
    {
      text: 'Add to Collection',
    },
  ],
  audio: [
    {
      text: 'Play',
    },
  ],
  video: [
    {
      text: 'Play',
      icon: <PlayIcon />,
    },
    {
      text: 'Add to Playlist',
      icon: <PlaylistIcon />,
    },
    'separator',
    {
      text: 'Refresh Metadata',
      icon: <RefreshIcon />,
    },
    {
      text: 'Fix Match',
      icon: <FixIcon />,
    },
  ],
}

export default function CardContextMenu({
  children,
  mediaType,
}: CardContextMenuProps) {
  return (
    <ContextMenu content={menu[mediaType]?.concat(menu.common.footer)}>
      {children}
    </ContextMenu>
  )
}
