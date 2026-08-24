import { Alert } from '@mui/material';
import { FiInfo } from 'react-icons/fi';

export default function InfoCKEditor() {
  return (
    <Alert variant='outlined'  icon={<FiInfo fontSize="inherit" />} severity="info">
      در هنگام آپلود تصویر در CKEDITOR منتظر نمایش تیک سبز رنگ در بالای تصویر (سمت راست) باشید تا عکس به صورت کامل آپلود شود ، سپس روی ثبت کلیک کنید.
    </Alert>
  );
}
