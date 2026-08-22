import { BaseResponse } from '@/_types/_bsResponse';
import { UserTypes } from '@/_types/_user';
import { tokenKey } from '@/config';
import { API_PATH_GET_USER } from '@/routes/path';
import { getFetcher } from '@/utils/getFetcher';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppDispatch } from '@/redux/hooks';
import { createUser } from '@/redux/slices/userSlice';

type UserProviderProps = {
  children: React.ReactNode;
};
export default function UserProvider({ children }: UserProviderProps) {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem(tokenKey);
  const { data, isLoading } = useSWR<BaseResponse<UserTypes.UserProfile>>(
    token ? API_PATH_GET_USER : null,
    getFetcher<UserTypes.UserProfile>,
    {},
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(createUser({ ...data.data }));
      console.log('useEffect set user data useState');
    }
  }, [data]);

  return <>{children}</>;
}
