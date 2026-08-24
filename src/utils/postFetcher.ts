import { apiClient } from '@/utils/apiClient';

export const postFetcher = async <TRequest, TResponse>(
  url: string,
  { arg }: { arg: TRequest },
): Promise<TResponse> => {
  const response = await apiClient.post<TResponse>(url, arg);

  return response.data;
};