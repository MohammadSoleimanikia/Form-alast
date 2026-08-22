import { Controller, useFormContext } from 'react-hook-form';
import { InputLabel, TextField, type TextFieldProps } from '@mui/material';

type Props = Omit<TextFieldProps, 'name' | 'type' | 'onChange'> & {
  name: string;
  maxLength?: number;
  labelText: string;
  formatNumber?: boolean;
};

const toEnglishDigits = (value: string) => {
  return value
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - '۰'.charCodeAt(0)))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - '٠'.charCodeAt(0)));
};

const formatWithComma = (value: string | number) => {
  if (value === '' || value == null) return '';

  const number = Number(String(value).replace(/,/g, ''));

  if (Number.isNaN(number)) return '';

  return new Intl.NumberFormat('en-US').format(number);
};

export default function RHFNumTextField({
  name,
  labelText = '',
  maxLength = 50,
  formatNumber = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex w-full flex-col">
          <InputLabel className="mb-2 hover:cursor-pointer" htmlFor={name}>
            {labelText}
          </InputLabel>

          <TextField
            id={name}
            size="small"
            {...other}
            {...field}
            type="tel"
            value={
              formatNumber
                ? formatWithComma(field.value ?? '')
                : (field.value ?? '')
            }
            slotProps={{
              htmlInput: {
                dir: 'rtl',
                inputMode: 'numeric',
                ...other.slotProps?.htmlInput,
                maxLength: maxLength,
              },
              ...other.slotProps,
            }}
            onChange={(event) => {
              const value = toEnglishDigits(event.target.value).replace(/\D/g, '');

              field.onChange(value);
            }}
            error={!!error}
            helperText={error?.message}
          />
        </div>
      )}
    />
  );
}