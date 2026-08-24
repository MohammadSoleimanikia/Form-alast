import { Controller, useFormContext } from 'react-hook-form';
import { InputLabel, TextField, type TextFieldProps } from '@mui/material';

type Props = Omit<TextFieldProps, 'name' | 'type' | 'onChange'> & {
  name: string;
  labelText: string;
};

export default function RHFTextField({ name,labelText, ...other }: Props) {
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
            size="small"
            {...other}
            {...field}
            id={name}
            type="text"
            value={field.value ?? ''}
            slotProps={{
              ...other.slotProps,
              htmlInput: {
                ...other.slotProps?.htmlInput,
              },
              formHelperText: {
                className: 'flex justify-start',
              },
            }}
            error={!!error}
            helperText={error?.message}
            className={other.className}
          />
        </div>
      )}
    />
  );
}
