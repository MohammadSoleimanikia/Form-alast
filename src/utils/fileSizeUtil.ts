export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} بایت`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} کیلوبایت`;
  }

  const mb = kb / 1024;

  return `${mb.toFixed(1)} مگابایت`;
};