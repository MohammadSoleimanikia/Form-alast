import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  createFilterOptions,
  InputLabel,
  TextField,
} from '@mui/material';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import { IoClose } from 'react-icons/io5';

type Props = Omit<
  AutocompleteProps<string, true, false, true>,
  'name' | 'value' | 'onChange' | 'options' | 'renderInput'
> & {
  name: string;
  labelText: string;
};

const filter = createFilterOptions<string>();

export default function RHFTagsInput({
  name,
  labelText,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: string[]) => {
          const normalized = value.map((item) => item.trim().toLowerCase());

          return (
            new Set(normalized).size === normalized.length ||
            'مقدار تکراری مجاز نیست'
          );
        },
      }}
      render={({ field, fieldState: { error } }) => {
        const tags: string[] = field.value ?? [];

        return (
          <div className="flex w-full flex-col">
            <InputLabel
              className="mb-2 cursor-pointer"
              htmlFor={name}
            >
              {labelText}
            </InputLabel>

            <Autocomplete
              {...other}
              multiple
              freeSolo
              id={name}
              size="small"
              options={[]}
              value={[]}
              onChange={(_, newValue) => {
                const newTags = newValue
                  .map((item) => item.trim())
                  .filter(Boolean);

                field.onChange(newTags);
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const inputValue = params.inputValue.trim();

                if (
                  inputValue !== '' &&
                  !filtered.includes(inputValue)
                ) {
                  filtered.push(inputValue);
                }

                return filtered;
              }}
              getOptionLabel={(option) => option}
              renderTags={() => null}
              slotProps={{
                popper: {
                  className: 'hidden',
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
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm"
                  >
                    <span>{tag}</span>

                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(
                          tags.filter((_, i) => i !== index)
                        );
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-200"
                    >
                      <IoClose size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}