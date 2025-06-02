import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignOut } from '@/components/ui/signOut';
import { SecuritySettings } from '@/components/SecuritySettings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HiOfficeBuilding } from 'react-icons/hi';
import { supabaseServer } from '@/utils/supabase/server';
import {
  FaHome,
  FaShoppingCart,
  FaInbox,
  FaBookOpen,
  FaHistory,
  FaCalendarAlt,
} from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { logos } from '@/constants/hero';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const supabase = await supabaseServer();

  if (!session) {
    redirect('/auth/login');
  }

  const [{ data: user, error: errorUser }, { data: user2fa, error: error2fa }] =
    await Promise.all([
      supabase
        .from('users')
        .select('id, email, username, is_confirmed, created_at, avatar_url')
        .eq('id', session.user.id)
        .single(),
      supabase
        .from('user_2fa')
        .select('id,user_id, email_2fa_enabled, app_2fa_enabled')
        .eq('user_id', session.user.id)
        .single(),
    ]);

  if (errorUser || error2fa) {
    console.error('Failed to fetch data:', errorUser ?? error2fa);
  }

  if (!user || !user2fa) {
    return <p>Nie znaleziono użytkownika w bazie.</p>;
  }

  const date = new Date(user.created_at).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  //temp
  const accounts = [
    {
      name: 'netflix',
      email: 'abc@example.com',
      password: '123456',
      src: '/dashboardLogos/netflix.png',
    },
    {
      name: 'prime_video',
      email: 'def@example.com',
      password: '654321',
      src: '/dashboardLogos/prime.png',
    },
  ];

  return (
    <main
      className={`min-h-screen max-h-screen min-w-screen bg-gradient-to-br from-[rgb(21,21,21)] to-black flex p-4`}>
      <section className={`w-1/5 flex ${!user.is_confirmed && 'blur-lg'}`}>
        <div className='w-1/6 flex flex-col justify-between items-center'>
          <div>
            <Image
              src={'/logo.png'}
              alt=''
              height={48}
              width={48}
              className='grayscale-100'
              priority
            />
          </div>
          <div className='flex flex-col justify-center items-center gap-6 text-xl text-[#9c9c9c] [&>*]:hover:text-white [&>*]:transition-all'>
            <Link href='/'>
              <FaHome />
            </Link>
            <Link href='/shop'>
              <FaShoppingCart />
            </Link>
            <div>
              <FaInbox />
            </div>
            <div>
              <Avatar>
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className='w-5/6 m-2 p-3 flex flex-col justify-between bg-[#161616] rounded-xl drop-shadow-md'>
          <div className='flex flex-col gap-3'>
            <div className='px-3 py-1'>
              <h1 className='text-2xl font-semibold pb-1'>{user.username}</h1>
              <span className='text-md font-semibold text-[#a1a1a1]'>
                @{user.email.split('@')[0]}
              </span>
            </div>
            <div>
              <ul className='text-[16px] flex flex-col gap-2 [&>*]:flex [&>*]:items-center [&>*]:gap-2 [&>*]:hover:bg-[#414141] [&>*]:transition-all [&>*]:duration-200 [&>*]:py-2 [&>*]:px-3 [&>*]:rounded-lg'>
                <li>
                  <FaBookOpen className='text-[#9c9c9c]' />
                  Overview
                </li>
                <li className='flex items-center w-full'>
                  <MdAccountCircle className='text-[#9c9c9c] text-[16px]' />
                  <span className='flex-grow'>Accounts</span>
                  <Badge className='h-5 min-w-[1.25rem] rounded-full px-1 font-mono tabular-nums'>
                    0
                  </Badge>
                </li>
                <li>
                  <FaHistory className='text-[#9c9c9c]' />
                  History
                </li>
              </ul>
            </div>
          </div>
          <div className='flex flex-col gap-2 text-[#9c9c9c] text-sm font-semibold'>
            <div className='flex items-center gap-2'>
              <FaCalendarAlt />
              <span>Member since: {date} </span>
            </div>
            <div className='flex items-center gap-2'>
              <HiOfficeBuilding />
              <span>@acctly.xyz</span>
            </div>
            <Separator />
            <button className='text-white font-medium py-[6px] border-primary border-1 hover:ring-3 hover:ring-primary hover:bg-[#212121] transition-all duration-300 rounded-md'>
              Edit profile
            </button>
          </div>
        </div>
      </section>
      <section
        className={`w-4/5 m-3 grid gap-6 [&>*]:rounded-xl [&>*]:bg-[#161616] ${
          !user.is_confirmed && 'blur-lg'
        }`}
        style={{
          gridTemplateColumns: '300px 1fr 1fr',
          gridTemplateRows: 'repeat(3, 1fr)',
        }}>
        <div className='relative w-full h-full overflow-hidden'>
          <img
            src={`/api/avatar?username=${user.username}`}
            alt='Profile'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='col-span-2'>2</div>
        <div className='row-start-2 p-6 flex flex-col justify-evenly'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-xl font-semibold'>Accounts</h1>
            <div className='grid grid-cols-4 grid-rows-2 gap-4'>
              {accounts.map((account, index) => {
                return (
                  <Link
                    href={`/dashboard/${account.name}`}
                    key={index}
                    className='flex items-center justify-center'>
                    <Image
                      src={account.src}
                      alt={''}
                      width={40}
                      height={40}
                      className='rounded-full'
                      quality={100}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <Badge>Beta</Badge>
            <span className='text-[#9c9c9c] text-sm'>Send feedback</span>
          </div>
        </div>
        <div className='col-span-2 row-start-2'>4</div>
        <div className='col-start-3 row-start-3'>5</div>
        <div className='col-span-2 col-start-1 row-start-3'>6</div>
      </section>
      {!user.is_confirmed && (
        <SecuritySettings
          email={session.user.email || 'itork555@gmail.com'}
          username={session.user.name || ''}
        />
      )}
    </main>
  );
}
