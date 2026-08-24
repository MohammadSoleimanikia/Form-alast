import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputLabel,
  TextField,
  type TextFieldProps,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';

type Props = Omit<TextFieldProps, 'name' | 'type' | 'onChange'> & {
  name: string;
  colorCodeName: string;
  labelText: string;
};

export default function RHFColor({
  name,
  colorCodeName,
  labelText,
  ...other
}: Props) {
  const { control, setValue, watch } = useFormContext();

  const [open, setOpen] = useState(false);

  const colorCode = watch(colorCodeName);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex w-full flex-col">
            <InputLabel className="mb-2 hover:cursor-pointer" htmlFor={name}>
              {labelText}
            </InputLabel>

            <div className="flex w-full">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-10 w-12 cursor-pointer items-center justify-center rounded-r-xl overflow-hidden border border-l-0 border-gray-300"
              >
                <span
                  className="h-full w-full  border"
                  style={{
                    backgroundColor: colorCode || '#ffffff',
                  }}
                />
              </button>
              <TextField
                size="small"
                {...other}
                {...field}
                id={name}
                type="text"
                value={field.value ?? ''}
                error={!!error}
                helperText={error?.message}
                className="w-full "
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomLeft:0
                  },
                }}
                slotProps={{
                  ...other.slotProps,

                  htmlInput: {
                    ...other.slotProps?.htmlInput,
                  },

                  formHelperText: {
                    className: 'flex justify-start',
                  },
                }}
              />

              
            </div>
          </div>
        )}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <MuiColorInput
            format="hex"
            value={colorCode || '#ffffff'}
            onChange={(value) => {
              setValue(colorCodeName, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}