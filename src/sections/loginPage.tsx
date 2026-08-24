import type { UserTypes } from '@/_types/_user';

import { useNavigate } from 'react-router';
import {
  LoginFormSchema,
  type LOGIN_MODE,
  type LoginFormValuesProps,
} from '@/_validations/authSchema';
import Image from '@/components/Image';
import LoginCountDown from '@/components/LoginCountDown';
import Page from '@/components/Page';
import RHFNumField from '@/components/react-hook-form/RHFNumField';
import FormProvider from '@/components/react-hook-form/FormProvider';
import { tokenKey } from '@/config';
import useLoginTimer from '@/hooks/useLoginTimer';
import { useAppDispatch } from '@/redux/hooks';
import { createUser } from '@/redux/slices/userSlice';
import { handleClearAuthSessions } from '@/utils/clearAuthSessions';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, IconButton, Typography } from '@mui/material';
import clsx from 'clsx';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';
import useSWRMutation from 'swr/mutation';
import { API_PATH_LOGIN, API_PATH_OTP } from '@/routes/path';
import { BaseResponse } from '@/_types/_bsResponse';
import type { LoginResponse, OtpResponse } from '@/_types/_auth';
import { mutationFetcher } from '@/services/authServices';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);

  //hooks
  const dispatch = useAppDispatch();

  const _currentMode = localStorage.getItem('mode') as LOGIN_MODE;
  const currentMode: LOGIN_MODE =
    _currentMode === 'LOGIN' ? 'LOGIN' : _currentMode === 'OTP' ? 'OTP' : 'LOGIN';

  //RHF
  const defaultValues: LoginFormValuesProps = {
    mobile: sessionStorage.getItem('m') || '',
    code: '',
    mode: currentMode,
  };

  const { trigger: loginTrigger, isMutating: isLoginMutating } = useSWRMutation<
    LoginResponse,
    Error,
    string,
    {
      mobile: string;
    }
  >(API_PATH_LOGIN, mutationFetcher);

  const { trigger: otpTrigger, isMutating: isOtpMutating } = useSWRMutation<
    BaseResponse<OtpResponse>,
    Error,
    string,
    {
      mobile: string;
      code: string;
    }
  >(API_PATH_OTP, mutationFetcher);

  const methods = useForm<LoginFormValuesProps>({
    resolver: yupResolver(LoginFormSchema) as any,
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, formState, watch, setValue } = methods;

  const { mode, code, mobile } = watch();

  //timer
  const timer = useLoginTimer(mode, countdownKey);

  //effects
  useEffect(() => {
    if (mobile.length === 0) {
      switchToLoginMode();
    }
  }, []);

  useEffect(() => {
    if (mode === 'OTP' && code?.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [code, mode]);

  const saveMobile = (mobile: string) => {
    sessionStorage.setItem('m', mobile);
  };

  const saveMode = (mode: LOGIN_MODE) => {
    localStorage.setItem('mode', mode);
    setValue('mode', mode);
  };

  //handlers

  const switchToOtpMode = () => {
    localStorage.removeItem('cur-t'); // reset timer
    setShowRetryBtn(false);
    saveMode('OTP');
    setValue('code', '');
  };

  const switchToLoginMode = () => {
    saveMode('LOGIN');
    setValue('code', '');
  };

  const handleLoginRequest = async (mobile: string) => {
    const res = await loginTrigger({
      mobile,
    });

    if (!res.success || res.statusCode !== 200) {
      throw new Error(res.message);
    }

    saveMobile(mobile);
    toast.success(`کد ورود شما :${res.code}`, { duration: 8000 });

    switchToOtpMode();
  };

  const handleOtpVerify = async (mobile: string, code: string) => {
    const res = await otpTrigger({
      mobile,
      code,
    });
    if (!res.success || !res.data) {
      throw new Error('کد وارد شده معتبر نیست');
    }

    localStorage.setItem(tokenKey, res.data.token);

    handleClearAuthSessions();

    const decoded = jwtDecode<JwtPayload & { role: UserTypes.USER_ROLE }>(res.data.token);

    dispatch(createUser({ ...res.data.user, role: decoded.role }));
    navigate('/');
  };

  const onSubmit = async (data: LoginFormValuesProps) => {
    try {
      if (data.mode === 'LOGIN') {
        await handleLoginRequest(data.mobile);
        return;
      }

      if (data.mode === 'OTP') {
        await handleOtpVerify(data.mobile, data.code!);
        return;
      }
    } catch (err: any) {
      return err;
    }
  };

  const onCompletedCountdown = () => {
    handleClearAuthSessions();
    setShowRetryBtn(true);
  };

  const resendOtp = async () => {
    await handleLoginRequest(mobile);
    setShowRetryBtn(false);
    setCountdownKey((prev) => prev + 1);
  };

  return (
    <Page title="ورود" disableHeaderTitle>
      <div className="flex size-full items-center justify-center py-32">
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          formProps={{
            className:
              'flex w-full max-w-[320px]  md:max-w-[380px] flex-col items-center p-2',
          }}
        >
          <div className="mb-3 h-fit w-fit">
            <Image
              src={'/img/webetologo.png'}
              className="size-24"
              alt="logo"
              visibleByDefault
            />
          </div>
          <Typography variant="h4">ورود به پنل مدیریت آپ تک</Typography>
          <Typography textAlign={'center'} variant="body1" color="textSecondary" mt={2}>
            لطفا شماره همراه خود را وارد کنید.
          </Typography>

          <div className="mt-8 flex w-full flex-col gap-2">
            {mode === 'LOGIN' ? (
              <RHFNumField
                key={'mobile'}
                name="mobile"
                maxLength={11}
                placeholder="شماره همراه"
                fullWidth
                slotProps={{
                  input: {
                    autoFocus: true,
                  },
                  htmlInput: {
                    sx: {
                      direction: 'ltr',
                    },
                  },
                }}
              />
            ) : (
              <RHFNumField
                key={Math.random().toString()}
                name="code"
                maxLength={6}
                placeholder="کد فعال سازی"
                fullWidth
                slotProps={{
                  input: {
                    autoFocus: true,
                  },
                  htmlInput: {
                    sx: {
                      direction: 'ltr',
                    },
                  },
                }}
              />
            )}
          </div>
          <div className="mt-7 w-full">
            <Button
              variant="contained"
              type="submit"
              loading={formState.isSubmitting}
              sx={{
                width: 1,
              }}
            >
              {mode === 'LOGIN' ? 'ورود' : 'تایید'}
            </Button>
            {mode === 'OTP' && (
              <div className="mt-3 flex w-full items-center justify-between">
                {showRetryBtn ? (
                  <Typography
                    className="text-primary-main cursor-pointer text-xs"
                    onClick={resendOtp}
                  >
                    ارسال مجدد کد
                  </Typography>
                ) : (
                  <LoginCountDown
                    timer={timer}
                    onCompletedCountdown={onCompletedCountdown}
                  />
                )}

                <div
                  className={clsx('flex cursor-pointer items-center gap-1 leading-none')}
                  onClick={switchToLoginMode}
                >
                  <Typography variant="caption" className="leading-none">
                    ویرایش شماره
                  </Typography>
                  <IconButton size="small">
                    <BsArrowLeft />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      </div>
    </Page>
  );
}
