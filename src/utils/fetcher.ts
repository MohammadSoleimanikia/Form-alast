import type { BaseResponse } from '@/_types/_bsResponse';
import { apiClient } from '@/utils/apiClient';
import { AxiosRequestConfig } from 'axios';

type PostFetcherArg<T> = {
  data: T;
  onProgress?: (progress: number) => void;
};

// post Fetcher ##############################################################################
export const postFetcher = async <TRequest, TResponse>(
  url: string,
  { arg }: { arg: PostFetcherArg<TRequest> },
  options?: AxiosRequestConfig<any, any> | undefined,
): Promise<TResponse> => {
  const response = await apiClient.post<TResponse>(url, arg.data, {
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;

      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

      arg.onProgress?.(percent);
    },
    ...options,
  });

  return response.data;
};

// custom post fetcher ##############################################################################
export const createSWRPostFetcher = (baseURL?: string) => {
  return async <TRequest, TResponse>(
    url: string,
    { arg }: { arg: PostFetcherArg<TRequest> },
    options?: AxiosRequestConfig<any, any> | undefined,
  ): Promise<TResponse> => {
    const response = await apiClient.post<TResponse>(url, arg.data, {
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        arg.onProgress?.(percent);
      },
      ...options,
      ...(baseURL !== undefined && { baseURL }),
    });

    return response.data;
  };
};

// get Fetcher ##############################################################################

export const getFetcher = async <TResponse>(
  url: string,
  options?: AxiosRequestConfig<any, any> | undefined,
): Promise<BaseResponse<TResponse>> => {
  const response = await apiClient.get<BaseResponse<TResponse>>(url, { ...options });
  return response.data;
};

// costum get fetcher ##############################################################################
export const createSWRGetFetcher = (baseURL?: string) => {
  return async <TResponse>(
    url: string,
    options?: AxiosRequestConfig<any, any> | undefined,
  ): Promise<BaseResponse<TResponse>> => {
    const response = await apiClient.get<BaseResponse<TResponse>>(url, {
      ...options,
      ...(baseURL !== undefined && { baseURL }),
    });
    return response.data;
  };
};
