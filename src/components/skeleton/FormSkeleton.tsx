import { Skeleton } from '@mui/material';
import Page from '../Page';
import FormWrapperSkeleton from './FormWrapperSkeleton';

export default function FormSkeleton() {
  return (
    <Page title="ایجاد محصول آماده جدید" disableHeaderTitle>
      <div className="mx-auto mt-6 flex size-full w-full flex-col px-6">
        <div className="w-full">
          <div className="flex w-full flex-col gap-5">
            <FormWrapperSkeleton>
              <Skeleton />
            </FormWrapperSkeleton>
          </div>
        </div>
      </div>
    </Page>
  );
}
