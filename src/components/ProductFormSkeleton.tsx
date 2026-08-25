import { Skeleton } from '@mui/material';

function SectionTitleSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-5 sm:flex-row sm:items-start md:items-center">
      <div className="flex w-full flex-col items-center gap-2.5 sm:flex-row sm:items-start">
        <Skeleton variant="rounded" width={48} height={48} />
        <div className="flex flex-col sm:items-start justify-center items-center gap-2">
          <Skeleton width={160} height={18} />
          <Skeleton width={220} height={14} />
        </div>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex w-full flex-col  gap-2">
      <Skeleton width={120} height={16} />
      <Skeleton variant="rounded" width="100%" height={40} />
    </div>
  );
}

function UploadBoxSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      width="100%"
      height={180}
      className="border border-dashed border-custom-surface2"
    />
  );
}

export default function ProductFormSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col gap-5">
      <div className="w-full rounded-md border border-custom-border bg-custom-surface1 p-5">
        <SectionTitleSkeleton />

        <div className="mt-5 grid w-full gap-5 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="w-full rounded-md border border-custom-border bg-custom-surface1 p-5">
        <SectionTitleSkeleton />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="w-full rounded-md border border-custom-border bg-custom-surface1 p-5">
        <SectionTitleSkeleton />

        <div className="mt-10 flex flex-col items-center gap-4">
          <Skeleton width={150} height={18} />
          <UploadBoxSkeleton />
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Skeleton width={150} height={18} />

          <div className="flex w-full flex-col gap-8 xxl:flex-row">
            <div className="w-full">
              <div className="w-full">
                <Skeleton variant="rounded" height={250} />
              </div>
            </div>

            <div className="w-full">
              <Skeleton variant="rounded" height={250} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-md border border-custom-border bg-custom-surface1 p-5">
        <SectionTitleSkeleton />

        <div className="mt-5 grid w-full gap-5 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <FieldSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="w-full rounded-md border border-custom-border bg-custom-surface1 p-5">
        <SectionTitleSkeleton />

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton width={160} height={18} />
            <Skeleton variant="rounded" width="100%" height={140} />
          </div>

          <Skeleton variant="rounded" width="100%" height={60} />

          <div className="flex flex-col gap-2">
            <Skeleton width={160} height={18} />
            <Skeleton variant="rounded" width="100%" height={260} />
          </div>

          <div className="mt-8 flex justify-end">
            <Skeleton variant="rounded" width={180} height={44} />
          </div>
        </div>
      </div>
    </div>
  );
}
