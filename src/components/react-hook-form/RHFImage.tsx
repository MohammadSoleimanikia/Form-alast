import { Typography } from '@mui/material';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import ItemPreview from '../ItemPreview';

type Props = {
  name: string;
};

export default function RHFImage({ name }: Props) {
  
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const oldImages = Array.isArray(field.value) ? field.value : [];
        
        const handleRemove = (index: number) => {
          const newFiles = oldImages.filter((_, fileIndex) => fileIndex !== index);
          field.onChange(newFiles);
        };
        return (
          <div
            className={clsx(
              oldImages.length == 0 && 'hidden',
              'group flex min-h-[200px] w-full flex-col items-center rounded-lg bg-[#E9ECEF] p-2',
            )}
          >
            <Typography variant="body1">عکس های موجود محصول</Typography>

            <div
              className={clsx('mt-5 flex h-[200px] w-full items-center justify-center')}
            >
              <div
                className={clsx(
                  'h-full w-full gap-5 overflow-y-auto',
                  'grid grid-cols-1 lg:grid-cols-2',
                )}
              >
                {oldImages.map((imageItem, index) => (
                  <ItemPreview
                    key={imageItem.id}
                    file={imageItem.image}
                    onRemove={() => handleRemove(index)}
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
