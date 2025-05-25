import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await getSession();

  /*  if (!session) {
    redirect('/auth/signin');
  } */

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {session?.user.name}!</p>
      <p>Your email: {session?.user.email}</p>
    </div>
  );
}
