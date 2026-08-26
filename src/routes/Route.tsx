import Loadable from '@/components/Loadable';
import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { ROUTES } from './path';
import NotFound from '@/pages/NotFound';
import { Navigate } from 'react-router-dom';
import { tokenKey } from '@/config';
import ProtectedRoute from '../guards/ProtectedRoute';
import Home from '@/pages/Home';

const Login = Loadable(lazy(() => import('@/sections/loginPage')));
const EditProduct = Loadable(lazy(() => import('@/pages/productForm/Edit')));
const AddProduct = Loadable(lazy(() => import('@/pages/productForm/Add')));

function Route() {
  const token = localStorage.getItem(tokenKey);

  const element = useRoutes([
    {
      path: ROUTES.LOGIN,
      element: token ? <Navigate to={ROUTES.ADD_PRODUCT} replace /> : <Login />,
    },

    // protected routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: ROUTES.HOME,
          element: <Home />,
        },
        {
          path: ROUTES.ADD_PRODUCT,
          element: <AddProduct />,
        },
        {
          path: ROUTES.EDIT_PRODUCT,
          element: <EditProduct />,
        },
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
