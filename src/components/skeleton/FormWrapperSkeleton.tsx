import { Skeleton, Typography } from '@mui/material';
import clsx from 'clsx';
import { ReactNode } from 'react';

export default function FormWrapperSkeleton({children}:{children:ReactNode}) {
  return (
    <div className="w-full rounded-lg bg-white p-5">
      {/* top section */}
      <div
        className={clsx(
          'flex flex-col items-center justify-center gap-5',
          'sm:flex-row sm:justify-between',
        )}
      >
        {/* header */}
        <div
          className={clsx(
            'flex flex-col items-center justify-center gap-3',
            'sm:flex-row',
          )}
        >
          {/* icon */}
          <Skeleton
          variant='rounded'
          className='!size-12'
           
          />
          
          <div>
            <Skeleton
              
              className={clsx('text-center font-light sm:text-right')}
            >
              
            </Skeleton>
            <Skeleton
              
              className={clsx('text-center font-extrabold text-gray-600 sm:text-right')}
            >
              
            </Skeleton>
          </div>
        </div>
      </div>
      {/* form section */}

      {/* use grid layout */}
      <div
        className={clsx(
          'mt-5 w-full gap-5 sm:mt-10',
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {children}
      </div>
    </div>
  );
}
