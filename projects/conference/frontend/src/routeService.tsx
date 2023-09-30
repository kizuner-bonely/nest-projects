import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { ErrorPage, Login, Register, UpdatePassword } from './pages'
import App from './App'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'update_password',
    element: <UpdatePassword />,
  },
]

export const router = createBrowserRouter(routes)
