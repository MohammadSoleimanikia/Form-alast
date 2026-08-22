import { apiClient } from '@/utils/apiClient';

export const mutationFetcher = async <TResponse, TRequest>(
  url: string,
  { arg }: { arg: TRequest },
): Promise<TResponse> => {
  const response = await apiClient.post<TResponse>(url, arg);

  return response.data;
};