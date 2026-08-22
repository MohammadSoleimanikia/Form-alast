import { Typography } from '@mui/material';
import Countdown from 'react-countdown';
import { type CountdownRendererFn } from 'react-countdown';

const OtpCountDownRenderer: CountdownRendererFn = ({ completed, total, formatted }) => {
  if (completed) {
    return null;
  }

  return (
    <div className="flex items-center justify-center text-text-primary">
      <span key={total}>
        {formatted.seconds}: {formatted.minutes}
      </span>
    </div>
  );
};

//---------------------------------------------------------------------------

interface Props {
  onCompletedCountdown: VoidFunction;
  timer?: string | number | Date | undefined;
}

export default function LoginCountDown({ timer, onCompletedCountdown }: Props) {
  return (
    <Typography
      variant="caption"
      component={'div'}
      className=" flex flex-wrap items-center justify-center gap-1 font-normal text-text-secondary">
      <div className="min-w-[35px]">
        <Countdown onComplete={onCompletedCountdown} renderer={OtpCountDownRenderer} date={timer} />
      </div>
      تا ارسال مجدد
    </Typography>
  );
}
