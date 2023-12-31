import { Flex } from '@radix-ui/themes'
import styled from 'styled-components'
import Collection from '~/components/Collection'
import useAPI from '~/hooks/useAPI'

const Container = styled(Flex).attrs({
  direction: 'column',
  gap: '4',
})`
  flex-grow: 1;
`

export default function Home() {
  const { data } = useAPI<'library.all'>('/library/all')

  return (
    <Container>
      {data?.map((library) => (
        <Collection key={library.id} library={library} type="recentlyAdded" />
      ))}
    </Container>
  )
}
