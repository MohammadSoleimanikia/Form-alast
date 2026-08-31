import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  InputLabel,
  TextField,
  type TextFieldProps,
} from '@mui/material';

type Option = {
  id: number;
  name: string;
};

type Props = Omit<
  AutocompleteProps<Option, false, false, false>,
  'name' | 'value' | 'onChange' | 'options' | 'renderInput'
> & {
  name: string;
  isDataLoading: boolean;
  labelText: string;
  options?: Option[] |null;
};

export default function RHFSelectAutoComplete({
  name,
  options = [],
  isDataLoading = false,
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
          <InputLabel className="mb-2 hover:cursor-pointer" htmlFor={name}>
            {labelText}
          </InputLabel>
          <Autocomplete
            {...other}
            id={name}
            slotProps={{}}
            size="small"
            options={options || []}
            value={options?.find((option) => option.id === field.value) || null}
            onChange={(_, newValue) => {
              field.onChange(newValue?.id ?? null);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  isDataLoading
                    ? 'در حال بارگزاری'
                    : options?.length === 0
                      ? 'اطلاعات زیرگروه موجود نمی‌باشد'
                      : 'انتخاب کنید'
                }
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </div>
      )}
    />
  );
}
