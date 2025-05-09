'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Props: attribute="class", defaultTheme, enableSystem, disableTransitionOnChange
 */
export function ThemeProvider(
  props: React.ComponentProps<typeof NextThemesProvider>
) {
  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>;
}
