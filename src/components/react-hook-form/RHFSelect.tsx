import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from '@mui/material';

type Option = {
  id: number;
  name: string;
};

type Props = Omit<SelectProps, 'name' | 'value' | 'onChange'> & {
  name: string;
  labelText: string;
  options: Option[];
};

export default function RHFSelect({
  name,
  options = [],
  labelText,
  ...other
}: Props) {
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

          <FormControl fullWidth size="small" error={!!error}>
            <Select
              {...other}
              id={name}
              value={field.value ?? ''}
              onChange={(event) => {
                field.onChange(
                  event.target.value === '' ? null : Number(event.target.value),
                );
              }}
              displayEmpty
              renderValue={(value) => {
                if (!value) {
                  return 'انتخاب کنید';
                }
                return options.find((option) => option.id === Number(value))?.name ?? '';
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </div>
      )}
    />
  );
}
