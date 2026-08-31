import { BaseResponse } from '@/_types/_bsResponse';
import { UserTypes } from '@/_types/_user';
import { tokenKey } from '@/config';
import { API_AUTH } from '@/services';
import { getFetcher,createSWRGetFetcher } from '@/utils/fetcher';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useAppDispatch } from '@/redux/hooks';
import { createUser } from '@/redux/slices/userSlice';
import { API_SECONDARY_URL } from '@/utils/config';

type UserProviderProps = {
  children: React.ReactNode;
};
export default function UserProvider({ children }: UserProviderProps) {
  const customGetFetcher= createSWRGetFetcher(API_SECONDARY_URL)
  const dispatch = useAppDispatch();
  const token = localStorage.getItem(tokenKey);
  const { data, isLoading } = useSWR<BaseResponse<UserTypes.UserProfile>>(
    token ? API_AUTH.GET_USER : null,
    customGetFetcher<UserTypes.UserProfile>,
    {},
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(createUser({ ...data.data }));
    }
  }, [data]);

  return <>{children}</>;
}
