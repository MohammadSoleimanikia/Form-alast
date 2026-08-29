import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputLabel } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CustomUploadAdapterPlugin } from '@/utils/ckeditorUploadAdapter';

type Props = {
  name: string;
  labelText: string;
  onImagesChange?: (images: string[]) => void;
};

export default function RHFCKEditor({ name, labelText, onImagesChange }: Props) {
  const { control} = useFormContext();

  // uploaded image
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleUploadSuccess = useCallback((url: string) => {
    setUploadedImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);
 
  // send to parent data
  useEffect(() => {
    onImagesChange?.(uploadedImages);
  }, [uploadedImages, onImagesChange]);

  const uploadPlugin = useMemo(
    () => CustomUploadAdapterPlugin(handleUploadSuccess),
    [handleUploadSuccess],
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <div dir="rtl" className="flex w-full flex-col">
          <InputLabel htmlFor={name} className="mb-2 cursor-pointer">
            {labelText}
          </InputLabel>

          <CKEditor
            editor={ClassicEditor}
            data={field.value ?? ''}
            config={{
              language: {
                ui: 'fa',
                content: 'fa',
              },
              extraPlugins: [uploadPlugin],
            }}
            onChange={(_, editor) => {
              field.onChange(editor.getData());
            }}
          />

          {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
      )}
    />
  );
}
