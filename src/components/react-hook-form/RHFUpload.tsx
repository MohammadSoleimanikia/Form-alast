import { FiUpload } from 'react-icons/fi';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ItemPreview from '../ItemPreview';
import toast from 'react-hot-toast';

type Props = {
  name: string;
  multiple?: boolean;
  title?: string;
};

export default function RHFUpload({ name, multiple = false, title }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleFiles = (files: FileList | null) => {
          if (!files) return;

          const selectedFiles = Array.from(files);

          if (multiple) {
            const previousFiles = Array.isArray(field.value) ? field.value : [];

            field.onChange([...previousFiles, ...selectedFiles]);
          } else {
            field.onChange(selectedFiles[0] ?? null);
          }
        };

        const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();

          setIsDragging(true);
        };

        const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
        };

        const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();

          setIsDragging(false);
        };

        const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();

          setIsDragging(false);

          handleFiles(event.dataTransfer.files);
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          handleFiles(event.target.files);
        };

        const files = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value
            ? [field.value]
            : [];

        const handleRemove = (index: number) => {
          if (multiple) {
            const newFiles = files.filter((_, fileIndex) => fileIndex !== index);
            field.onChange(newFiles);
          } else {
            field.onChange(null);
          }
          toast.success('تصویر با موفقیت حذف شد')
        };
        return (
          <div className="flex w-full flex-col items-center gap-4">
            <input
              type="file"
              onChange={handleChange}
              multiple={multiple}
              hidden
              ref={inputRef}
              accept=".jpg,.jpeg,.png,.webp"
            />

            {/* title */}
            {title && <Typography variant="body1">{title}</Typography>}

            {/* upload section */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={clsx(
                'group flex min-h-[200px] w-full flex-col items-center rounded-lg bg-[#E9ECEF] p-2 hover:cursor-pointer',
              )}
            >
              <Typography variant="body1">آپلود فایل</Typography>

              <Typography variant="body2" className="mt-2">
                لطفا فایل را کشیده و در باکس رها کنید
              </Typography>

              <div
                className={clsx('mt-5 flex h-[200px] w-full items-center justify-center')}
              >
                {files.length > 0 ? (
                  <div
                    className={clsx(
                      'h-full w-full gap-5 overflow-y-auto',
                      multiple
                        ? 'grid grid-cols-1 lg:grid-cols-2'
                        : 'flex flex-col items-center',
                    )}
                  >
                    {files.map((file, index) => (
                      <ItemPreview
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        file={file}
                        onRemove={() => handleRemove(index)}
                      />
                    ))}
                  </div>
                ) : (
                  //  upload shape
                  <div className="group relative my-4 max-w-32">
                    {/* border behind */}
                    <div
                      className={clsx(
                        'absolute inset-0 rounded-lg border-[1.5px] border-dotted',
                        isDragging ? 'border-green-500' : 'border-red-300',
                      )}
                    />

                    {/* main shape  */}
                    <div
                      className={clsx(
                        'relative z-10 flex size-32 flex-col items-center justify-center overflow-hidden rounded-lg bg-[#F3D9A5]',
                        'transition-transform duration-300',
                        'group-hover:-translate-y-2 group-hover:translate-x-2',
                        isDragging && '-translate-y-2 translate-x-2',
                      )}
                    >
                      <FiUpload className="size-5" />

                      <Typography variant="caption" className="mt-2">
                        {isDragging && 'رها کنید'}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
