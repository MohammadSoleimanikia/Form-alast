import { Controller, useFormContext } from 'react-hook-form';
import { FormControlLabel, Switch, type SwitchProps } from '@mui/material';
import clsx from 'clsx';

type Props = Omit<SwitchProps, 'name'> & {
  name: string;
  labelText: string;
};

export default function RHFSwitch({ name, labelText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <FormControlLabel
          value={'end'}
          className={clsx( field.value &&'text-[#D6A54A] ')}
          label={labelText}
          slotProps={{typography:{
            className:"pr-3 font-extrabold transition-color duration-500"
          }}}
          control={
            <Switch
              size="medium"
              {...other}
              checked={field.value ?? false}
              onChange={(event) => {
                field.onChange(event.target.checked);
              }}
            />
          }
        />
      )}
    />
  );
}
