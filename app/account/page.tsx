import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // lub gdzie masz `authOptions`
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {session.user.name}!</p>
      <p>Your email: {session.user.email}</p>
      <img
        src={session.user.image ?? '/default-avatar.png'}
        alt=''
        height={20}
        width={20}
      />
    </div>
  );
}
