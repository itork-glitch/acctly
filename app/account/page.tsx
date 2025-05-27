import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignOut } from '@/components/ui/signOut';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {session.user.name}!</p>
      <p>Your email: {session.user.email}</p>
      <SignOut />
    </div>
  );
}
