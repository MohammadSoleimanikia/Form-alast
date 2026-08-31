import { Controller, useFormContext } from 'react-hook-form';
import { FormHelperText, InputLabel } from '@mui/material';
import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type Props = Omit<DateTimePickerProps, 'value' | 'onChange' | 'name'> & {
  name: string;
  labelText: string;
};

export default function RHFDatePicker({ name, labelText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex w-full flex-col">
          <InputLabel htmlFor={name} className="mb-2 hover:cursor-pointer">
            {labelText}
          </InputLabel>

          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <DateTimePicker
              {...other}
              value={field.value ? new Date(field.value * 1000) : null}
              onChange={(value) => {
                if (!value) {
                  field.onChange(null);
                  return;
                }

                const now = new Date();

                // اگر کاربر ساعت را انتخاب نکرده باشد،
                // DatePicker ساعت را 00:00 قرار می‌دهد.
                if (
                  value.getHours() === 0 &&
                  value.getMinutes() === 0 &&
                  value.getSeconds() === 0
                ) {
                  value.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
                }

                field.onChange(Math.floor(value.getTime() / 1000));
              }}
              ampm={false}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: !!error,
                },
                desktopPaper: {
                  dir: 'rtl',
                },
                mobilePaper: {
                  dir: 'rtl',
                },
                actionBar: {
                  actions: [],
                },
              }}
            />
          </LocalizationProvider>

          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
      )}
    />
  );
}
