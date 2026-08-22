import type { LOGIN_MODE } from '@/_validations/authSchema';
import { useMemo } from 'react';

const OTP_DURATION = 120 * 1000;

export default function useLoginTimer(mode: LOGIN_MODE, resetKey: number) {

  
  const timer = useMemo(() => {

    if (mode !== 'OTP') return;

    const now = Date.now();
    
    const stored = localStorage.getItem('cur-t');

    if (stored) {
      const endTime = Number(stored);

      if (endTime > now) {
        return endTime;
      }

      // timer expired
      localStorage.removeItem('cur-t');
    }

    const endTime = now + OTP_DURATION;

    localStorage.setItem('cur-t', endTime.toString());

    return endTime;
  }, [mode, resetKey]);

  return timer;
}
