import { Flex } from '@radix-ui/themes'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { useLocalStorage } from 'usehooks-ts'
import useAPI from '~/hooks/useAPI'
import Sidebar from './Sidebar'

const Container = styled(Flex)`
  --margin: var(--space-4);
  gap: var(--margin);
  height: calc(100% - calc(var(--margin) * 2));
  margin: var(--margin);
`

export default function Layout() {
  const { data } = useAPI<'library.all'>('/library/all')
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(
    'sidebar.open',
    true,
  )

  return (
    <Container>
      <Sidebar open={isSidebarOpen} setOpen={setIsSidebarOpen}>
        <ul>
          {data?.map((library) => (
            <li key={library.id}>
              <a href="">{library.name}</a>
            </li>
          ))}
        </ul>
      </Sidebar>
      <Outlet />
    </Container>
  )
}
