import { Flex, Link, Card as RUICard } from '@radix-ui/themes'
import styled from 'styled-components'
import { Media } from '@neon/shared/types'
import Poster from '~/components/Poster'
import CardContextMenu from './CardContextMenu'

type CardProps = {
  data: Media
}

const Container = styled(RUICard).attrs({
  variant: 'ghost',
})`
  transition: transform 120ms ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const Content = styled(Flex).attrs({
  direction: 'column',
  gap: '1',
})``

const TitleLink = styled(Link).attrs({
  size: '2',
  ml: '1',
  mr: 'auto',
})`
  color: var(--gray-12);
`

export default function Card({ data }: CardProps) {
  const link = `/app/media/${data.id}/${data.slug}`

  return (
    <CardContextMenu mediaType={data.type}>
      <Container>
        <Content>
          <Link href={link}>
            <Poster data={data} />
          </Link>
          <TitleLink href={link}>{data.title}</TitleLink>
        </Content>
      </Container>
    </CardContextMenu>
  )
}
