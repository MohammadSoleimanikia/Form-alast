import { Button, CircularProgress } from '@mui/material';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import { FaCheck } from 'react-icons/fa';

type Props = {
  isLoading?: boolean;
  progressPercentage: number;
  children:ReactNode;
};
export default function ProgressButton({ isLoading = false, progressPercentage,children }: Props) {
  if (isLoading) {
    return (
      <div className="relative mr-auto flex h-10 w-full min-w-[136px] items-center justify-center overflow-hidden rounded-md bg-[#eadcc5] sm:w-fit">
        {/* progress background */}
        <div
          className="absolute inset-y-0 right-0 bg-[#966e22] transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
          }}
        />

        {/* content */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <span className="text-sm font-medium">{progressPercentage}%</span>

          <CircularProgress size={18} thickness={5} color="inherit" />
        </div>
      </div>
    );
  }
  return (
    <Button
      variant="contained"
      startIcon={<FaCheck />}
      size="medium"
      className={clsx('mr-auto h-10 w-full min-w-[136px] !bg-[#966e22] sm:w-fit')}
      type="submit"
    >
      {children}
    </Button>
  );
}
