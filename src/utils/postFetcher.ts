import { apiClient } from '@/utils/apiClient';

type PostFetcherArg<T> = {
  data: T;
  onProgress?: (progress: number) => void;
};

export const postFetcher = async <TRequest, TResponse>(
  url: string,
  { arg }: { arg: PostFetcherArg<TRequest> },
): Promise<TResponse> => {
  const response = await apiClient.post<TResponse>(url, arg.data, {
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;

      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );

      arg.onProgress?.(percent);
    },
  });

  return response.data;
};