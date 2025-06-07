import React, { Suspense } from 'react';
import { ShopService } from '@/utils/shop/shopService';
import { ProductSkeleton } from '@/components/shop/ShopComponents';
import ShopClient from './ShopClient';

interface ShopPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const initialData = await ShopService.getProductsForSSR();

  return (
    <div className='min-h-screen bg-[#111111] text-white'>
      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopClient
          initialProducts={initialData.products}
          initialCategories={initialData.categories}
          initialBrands={initialData.brands}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}

function ShopPageSkeleton() {
  return (
    <div className='min-h-screen bg-[#111111] text-white'>
      {/* Header skeleton */}
      <div className='border-b border-gray-700 bg-[#111111]'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-lg bg-gray-700' />
              <div className='h-6 w-24 bg-gray-700 rounded' />
            </div>
            <div className='flex-1 max-w-2xl mx-8'>
              <div className='h-12 bg-gray-800 rounded-full' />
            </div>
            <div className='flex items-center gap-4'>
              <div className='h-10 w-10 bg-gray-700 rounded' />
              <div className='h-10 w-10 bg-gray-700 rounded' />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className='container mx-auto px-4 py-8'>
        <div className='flex gap-8'>
          {/* Filters skeleton */}
          <div className='w-80'>
            <div className='bg-[#212121] rounded-lg p-6 border border-[#414141]'>
              <div className='h-6 w-20 bg-gray-700 rounded mb-4' />
              <div className='space-y-4'>
                <div className='h-4 w-24 bg-gray-700 rounded' />
                <div className='h-6 w-full bg-gray-700 rounded' />
              </div>
            </div>
          </div>

          {/* Products skeleton */}
          <div className='flex-1'>
            <div className='flex items-center justify-between mb-6'>
              <div className='h-8 w-48 bg-gray-700 rounded' />
              <div className='h-6 w-32 bg-gray-700 rounded' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata for SEO
export async function generateMetadata() {
  return {
    title: 'ShopDark - Premium Products',
    description:
      'Discover amazing products with fast delivery and great prices.',
  };
}
