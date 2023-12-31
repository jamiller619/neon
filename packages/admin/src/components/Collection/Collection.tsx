import { Link } from '@radix-ui/themes'
import styled from 'styled-components'
import { Library } from '@neon/shared/types'
import Panel from '~/components/Panel'
import useAPI from '~/hooks/useAPI'
import CollectionGrid from './CollectionGrid'

type CollectionProps = {
  library: Library
  type: keyof typeof collections
}

const collections = {
  recentlyAdded: {
    url: (libraryId: string): `/${string}` => {
      return `/library/${libraryId}/media?col=createdAt&dir=asc&page=0&length=8`
    },
    title: 'Recently Added',
  },
}

const Container = styled(Panel.Flex)`
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  width: 100%;
`

const HeadingLink = styled(Link).attrs({
  size: '5',
  weight: 'medium',
  mr: 'auto',
})``

export default function Collection({ type, library }: CollectionProps) {
  const { data } = useAPI<'media.paged'>(collections[type].url(library.id))

  return (
    <Container>
      <HeadingLink>
        {collections[type].title} in {library.name}
      </HeadingLink>
      <CollectionGrid data={data?.items} />
    </Container>
  )
}
