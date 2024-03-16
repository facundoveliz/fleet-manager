import Map from '@/pages/map/index';

export default function Home() {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='pb-8 text-2xl font-medium'>Fleet Manager</h1>
      <Map />
    </div>
  );
}
