'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountClient() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true,
    });
  };

  const handleEditProfile = () => {
    // You can implement profile editing later
    alert('Profile editing coming soon!');
  };

  return (
    <div className='mt-8 space-y-4'>
      <button
        onClick={handleEditProfile}
        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200'>
        Edit Profile
      </button>

      <button
        onClick={handleSignOut}
        className='w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200'>
        Sign Out
      </button>

      <button
        onClick={() => router.push('/')}
        className='w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200'>
        Back to Home
      </button>
    </div>
  );
}
