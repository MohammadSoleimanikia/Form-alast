import Loadable from '@/components/Loadable';
import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { ADD_PRODUCT, HOME, LOGIN } from './path';
import NotFound from '@/pages/NotFound';
import { Navigate } from 'react-router-dom';
import { tokenKey } from '@/config';
import ProtectedRoute from './ProtectedRoute';
import Home from '@/pages/Home';
import AddProductPage from '@/pages/productForm/Add';

const Login = Loadable(lazy(() => import('@/sections/loginPage')));

function Route() {
  const token = localStorage.getItem(tokenKey);

  const element = useRoutes([
    {
      path: LOGIN,
      element: token ? <Navigate to="/" replace /> : <Login />,
    },

    // protected routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: HOME,
          element: <Home/>,
        },
        {
          path:ADD_PRODUCT,
          element:<AddProductPage/>
        }
      ],
    },

    //  404 page
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
}

export default Route;
