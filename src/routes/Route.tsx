import Loadable from '@/components/Loadable';
import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { ADD_PRODUCT, EDIT_PRODUCT, HOME, LOGIN } from './path';
import NotFound from '@/pages/NotFound';
import { Navigate } from 'react-router-dom';
import { tokenKey } from '@/config';
import ProtectedRoute from './ProtectedRoute';
import Home from '@/pages/Home';

const Login = Loadable(lazy(() => import('@/sections/loginPage')));
const EditProduct = Loadable(lazy(() => import('@/pages/productForm/Edit')));
const AddProduct = Loadable(lazy(() => import('@/pages/productForm/Add')));

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
          element:<AddProduct/>
        },
        {
          path:`${EDIT_PRODUCT}/:productId`,
          element:<EditProduct/>
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
