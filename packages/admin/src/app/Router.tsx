import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from '~/components/Layout'
import Home from '~/pages/Home'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // {
      //   path: 'account/*',
      //   element: <Account />,
      // },
      // {
      //   path: 'settings/*',
      //   element: <Settings />,
      // },
      // {
      //   path: 'media/*',
      //   element: <Media />,
      // },
      // {
      //   path: 'watch/*',
      //   element: <WatchRouter />,
      // },
      // {
      //   path: 'library/*',
      //   element: <LibraryRouter />,
      // },
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/app',
})

export default function Router() {
  return <RouterProvider router={router} />
}
