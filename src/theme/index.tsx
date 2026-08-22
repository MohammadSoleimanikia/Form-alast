'use client';

import { alpha, CssBaseline, ThemeProvider as Provider } from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ReactNode, useMemo } from 'react';
import BreakPoints from './breakpoints';
import typography from '@/theme/typography';
import palette from '@/theme/palette';
import shadows, { customShadows } from '@/theme/shadows';
import ComponentsOverrides from '@/theme/overrides';
import { CacheProvider } from '@emotion/react';
import rtlCache from './rtlCache';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: {
        ...palette.light,
      },
      typography,
      breakpoints: {
        values: BreakPoints,
      },
      direction: 'rtl',
      shape: { borderRadius: 8 },
      shadows: shadows.light,
      customShadows: {
        ...customShadows.light,
      },
      cssVariables: true,
    }),
    [],
  );

  const theme = createTheme(themeOptions);

  theme.components = ComponentsOverrides(theme);

  return (
    <CacheProvider value={rtlCache}>
      <Provider theme={theme}>
        <CssBaseline />
        {children}
      </Provider>
    </CacheProvider>
  );
}
