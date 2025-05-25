'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AuthSessionProvider({ children }: Props) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
