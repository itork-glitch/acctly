export default function LoginGradient() {
  return (
    <div className='absolute top-0 right-0 overflow-hidden'>
      <video
        className='object-cover w-full h-full'
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        poster='/animations/gradient_poster.png'>
        <source src='/animations/gradient.mp4' type='video/mp4' />
      </video>
    </div>
  );
}
