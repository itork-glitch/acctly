import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    userID: session?.user?.id,
    username: session?.user?.name,
    email: session?.user?.image,
    avatar: session?.user?.image,
  };
}
