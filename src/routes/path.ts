
export const ROUTES = {
  ADD_PRODUCT: '/product/add',
  EDIT_PRODUCT: '/product/edit/:productId',
  LOGIN: '/login',
  HOME: '/',
};

export const API_AUTH = {
  LOGIN: '/login',
  OTP: '/verify-otp',
  GET_USER: '/getUser',
};

export const API_PRODUCT = {
  GET_PRODUCT: '/admin/product/show/panel',
  GET_PRODUCT_CATEGORY: '/admin/group/main',
  GET_PRODUCT_GROUP: '/admin/group/sub',
  ADD_PRODUCT: '/admin/product/store',
  UPDATE_PRODUCT: '/admin/product/update',
  UPLOAD_IMAGE: '/admin/upload-image',
  DESTROY_IMAGE:'/admin/product-images/destroy'
};
