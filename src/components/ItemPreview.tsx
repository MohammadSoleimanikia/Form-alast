import { formatFileSize } from '@/utils/fileSizeUtil';
import { Avatar, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
type Props = {
  file: File | string;
  onRemove: () => void;
  isRemoving?: boolean;
};
export default function ItemPreview({ file, onRemove, isRemoving = false }: Props) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (typeof file == 'string') {
      setPreview(file);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      if (typeof file == 'string') return;
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return (
    <div className="flex h-[74px] w-full items-center justify-between rounded-md bg-white p-3">
      {/*  */}
      <div className="flex items-center gap-1">
        <Avatar
          src={preview}
          className="box-content h-full rounded-full border-2 border-black object-cover"
        />
        <div>
          <Typography variant="body2" className="line-clamp-1 max-w-[250px] font-bold">
            {typeof file == 'string' ? 'فایل سرور' : file.name}
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            {typeof file == 'string' ? 'فایل موجود' : formatFileSize(file.size)}
            {}
          </Typography>
        </div>
      </div>

      {/* remove btn  */}
      <div
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className="flex size-9 items-center justify-center rounded-full hover:bg-gray-100"
      >
        {isRemoving ? (
          <CircularProgress size={18} thickness={5} color="inherit" />
        ) : (
          <FaTrash className="size-[18px] text-red-500" />
        )}
      </div>
    </div>
  );
}
