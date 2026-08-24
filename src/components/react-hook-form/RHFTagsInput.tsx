import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Chip, InputLabel, TextField } from '@mui/material';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

type Props = Omit<
  AutocompleteProps<string, true, false, true>,
  'name' | 'value' | 'onChange' | 'options' | 'renderInput'
> & {
  name: string;
  labelText: string;
};

export default function RHFTagsInput({ name, labelText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error } }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const removeTag = (index: number) => {
          field.onChange(tags.filter((_, i) => i !== index));
        };

        return (
          <div className="flex w-full flex-col">
            <InputLabel htmlFor={name} className="mb-2 cursor-pointer">
              {labelText}
            </InputLabel>

            <Autocomplete
              {...other}
              multiple
              freeSolo
              id={name}
              size="small"
              options={[]}
              value={tags}
              onChange={(_, newValue) => {
                const newTags = newValue.map((item) => item.trim()).filter(Boolean);

                field.onChange(newTags);
              }}
              renderTags={() => null}
              slotProps={{
                popper: {
                  sx: {
                    display: 'none',
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="برای افزودن مورد Enter را بزنید"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />

            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2">
                {tags.map((tag, index) => (
                  <Chip
                  variant='outlined'
                    key={`${tag}-${index}`}
                    label={tag}
                    onDelete={() => removeTag(index)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
