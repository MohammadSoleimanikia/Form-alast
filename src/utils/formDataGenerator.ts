export const formDataGenerator =(
  data:any,
): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Array
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item === undefined || item === null) {
          return;
        }

        // file in array 
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
          // number
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });

      continue;
    }

    // File
    if (value instanceof File) {
      formData.append(key, value);
      continue;
    }

    // Primitive
    formData.append(key, String(value));
  }

  return formData;
};