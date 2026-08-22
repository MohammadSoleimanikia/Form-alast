import { PHONE_REGEX } from '@/utils/regex';
import * as yup from 'yup';

export type LOGIN_MODE = 'LOGIN' | 'OTP';

export const LoginFormSchema = yup.object({
  mobile: yup
    .string()
    .required('شماره تلفن الزامی میباشد')
    .matches(PHONE_REGEX, 'شماره تلفن صحیح نمی باشد'),

  code: yup
    .string()
    .when('mode', {
      is: 'OTP',
      then: (schema) =>
        schema
          .required('کد فعال سازی الزامی میباشد')
          .length(6, 'کد فعال سازی باید ۶ رقم باشد'),
      otherwise: (schema) => schema.notRequired(),
    }),

  mode: yup
    .mixed<LOGIN_MODE>()
    .oneOf(['LOGIN', 'OTP'])
    .required(),
});


export type LoginFormValuesProps = yup.InferType<
  typeof LoginFormSchema
>;