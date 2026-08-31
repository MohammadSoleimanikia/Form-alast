import { Typography } from '@mui/material';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import ItemPreview from '../ItemPreview';
import useSWRMutation from 'swr/mutation';
import { API_PRODUCT } from '@/services';
import { createSWRPostFetcher, postFetcher } from '@/utils/fetcher';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { API_BASE_ADMIN_URL } from '@/utils/config';

type Props = {
  name: string;
};

type ImageItem = {
  id: string;
  image: string;
};

export default function RHFImage({ name }: Props) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const customPostFethcer = createSWRPostFetcher(API_BASE_ADMIN_URL);
  const { trigger, isMutating: isRemoving } = useSWRMutation(
    API_PRODUCT.DESTROY_IMAGE,
    customPostFethcer,
  );

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const oldImages: ImageItem[] = Array.isArray(field.value)
          ? field.value
          : [];

        const handleRemove = async (id: string) => {
          const confirmed = window.confirm(
            'این عمل برگشت‌ناپذیر است. آیا مطمئن هستید؟',
          );

          if (!confirmed) return;

          try {
            setRemovingId(id);

            await trigger({
              data: { id },
            });

            toast.success('تصویر با موفقیت حذف شد');

            const newFiles = oldImages
              .filter((item) => item.id !== id);

            field.onChange(newFiles);
          } catch (error) {
            toast.error('مشکلی در حذف فایل از سرور پیش آمده است');
          } finally {
            setRemovingId(null);
          }
        };

        return (
          <div
            className={clsx(
              oldImages.length === 0 && 'hidden',
              'group flex min-h-[200px] w-full flex-col items-center rounded-lg bg-[#E9ECEF] p-2',
            )}
          >
            <Typography variant="body1">
              عکس های موجود محصول
            </Typography>

            <div className="mt-5 flex h-[200px] w-full items-center justify-center">
              <div
                className={clsx(
                  'h-full w-full gap-5 overflow-y-auto',
                  'grid grid-cols-1 lg:grid-cols-2',
                )}
              >
                {oldImages.map((imageItem) => (
                  <ItemPreview
                    key={imageItem.id}
                    isRemoving={
                      isRemoving && removingId === imageItem.id
                    }
                    file={imageItem.image}
                    onRemove={() => handleRemove(imageItem.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
