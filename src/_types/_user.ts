import type {BaseResponse as PaginatedResult } from './_bsResponse';

export const GENDER: { [key in UserTypes.GENDER]: string } = {
  '0': 'زن',
  '1': 'مرد',
  '2': 'سایر',
};

export const IS_ACTIVE: { [key in 0 | 1]: string } = {
  0: 'غیر فعال',
  1: 'فعال',
};

export const USER_TYPE: { [key in UserTypes.USER_TYPE]: string } = {
  regular: 'حقیقی',
  legal: 'حقوقی',
};

export const USER_ROLE: { [key in UserTypes.USER_ROLE]: string } = {
  author: 'نویسنده',
  installer: 'نصاب',
  supplier: 'تامین کننده',
  user: 'کاربر عادی',
  admin: 'ادمین',
};

export const USER_EN_ROLE: { [key in UserTypes.USER_ROLE]: string } = {
  author: 'author',
  installer: 'installer',
  supplier: 'supplier',
  user: 'user',
  admin: 'admin',
};

export namespace UserTypes {

  export type UserStatusType = 0 | 1 ;

  export interface InitialState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    userProfile: UserProfile | null;
  }

  export interface UserProfile {
    id?: number;
    name: string;
    mobile: string;
    telephone?: string;
    created_at: string;
    role: USER_ROLE;
    gender: GENDER;
    avatar?: string;
    status: UserStatusType;
    addresses: UserAddress[];
    wallet: string;
    notifications: Notification[];
  }

  export interface UserAddress {
    id: number;
    title: string;
    address: string;
  }

  export interface GetUserApiRes {
    user: {
      status: UserStatusType;
      mobile: string;
      auth_key: string;
      name: string;
      gender: UserTypes.GENDER;
      rols: string;
      wallet: string;
    };
  }

  export type GENDER = '0' | '1' | '2';

  export type USER_TYPE = 'regular' | 'legal';

  export type USER_ROLE = 'user' | 'author' | 'installer' | 'supplier' | 'admin';

  export type UserListApiRes = PaginatedResult<UserProfile>;
}
