import { Typography } from '@mui/material';
import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  discountSection?: ReactNode;
  isGrid: boolean;
};
export default function FormSectionWrapper({
  title,
  icon,
  description,
  discountSection,
  children,
  isGrid,
}: Props) {
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
          <div
            className={clsx(
              'flex size-12 items-center justify-center',
              'rounded-md bg-[#FFF8EB] p-2 text-[#A97A21] sm:size-11',
            )}
          >
            {icon}
          </div>
          <div>
            <Typography
              variant="body1"
              className={clsx('text-center font-light sm:text-right')}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              className={clsx('text-center font-extrabold text-gray-600 sm:text-right')}
            >
              {description}
            </Typography>
          </div>
        </div>
        {/* discount if available */}
        {discountSection && discountSection}
      </div>
      {/* form section */}

      {/* use grid layout */}
      {isGrid && <div className={clsx('mt-5 w-full gap-5 sm:mt-10 ',
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')}>{children}</div>}

      {/* is not grid */}
      {!isGrid && <div className={clsx('mt-5 w-full sm:mt-10')}>{children}</div>}
    </div>
  );
}
