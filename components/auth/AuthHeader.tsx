import Image from 'next/image';

export default function AuthHeader() {
  return (
    <>
      <div className='flex items-center gap-2 mb-5'>
        <Image
          src='/logo.png'
          alt='Acctly Logo'
          height={32}
          width={32}
          priority
          className='grayscale-100'
        />
        <h1 className='text-3xl font-extrabold mb-2'>
          Keep your all accounts organized in one place
        </h1>
        <p className='text-[#9c9c9c] mb-6'>Login to access your account</p>
      </div>
    </>
  );
}
