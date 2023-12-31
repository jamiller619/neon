import styled from 'styled-components'
import { Media } from '@neon/shared/types'
import Card from './Card'

type CollectionGridProps = {
  data?: Media[]
}

const Container = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-5);
`

export default function CollectionGrid({ data }: CollectionGridProps) {
  return (
    <Container>
      {data?.map((item) => <Card key={item.id} data={item} />)}
    </Container>
  )
}
