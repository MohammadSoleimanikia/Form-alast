import axios from 'axios';
import toast from 'react-hot-toast';

import { API_PATH_UPLOAD_IMAGE } from '@/routes/path';
import { apiClient } from './apiClient';

class MyUploadAdapter {
  private loader: any;
  private controller: AbortController;
  private onUploadSuccess: (url: string) => void;

  constructor(loader: any, onUploadSuccess: (url: string) => void) {
    this.loader = loader;
    this.controller = new AbortController();
    this.onUploadSuccess = onUploadSuccess;
  }

  upload() {
    return this.loader.file.then(async (file: File) => {
      try {
        const formData = new FormData();

        formData.append('image', file);

        const response = await apiClient.post(API_PATH_UPLOAD_IMAGE, formData, {
          signal: this.controller.signal,
        });

        if (response.status !== 200 || !response.data.success) {
          throw new Error(response.data.message);
        }

        const url = response.data.data?.url;

        if (!url) {
          throw new Error('آدرس عکس دریافت نشد');
        }

        // 
        this.onUploadSuccess(url);

        return {
          default: url,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);

        toast.error(message);

        throw new Error(message);
      }
    });
  }

  abort() {
    this.controller.abort();
  }
}

export function CustomUploadAdapterPlugin(
  onUploadSuccess: (url: string) => void,
) {
  return function (editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: any,
    ) => {
      return new MyUploadAdapter(loader, onUploadSuccess);
    };
  };
}