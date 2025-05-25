import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/utils/supabase/admin';
import AccountClient from './AccountClient';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  /*   if (!session || !session.user) {
    redirect('/login');
  } */

  // Get additional user data from database
  let userData = null;
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, username, created_at')
      .eq('id', session?.user.id)
      .single();

    if (!error && user) {
      userData = user;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>
          Account Information
        </h1>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <p className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md'>
              {session.user.email}
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Username
            </label>
            <p className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md'>
              {userData?.username || session.user.name || 'No username set'}
            </p>
          </div>

          {userData?.created_at && (
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Member Since
              </label>
              <p className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md'>
                {new Date(userData.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <AccountClient />
      </div>
    </div>
  );
}
