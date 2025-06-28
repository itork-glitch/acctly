import React from 'react';
import { supabaseServer } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

interface ProductProps {
  params: Promise<{ product: string }>;
}

export default async function ProductPage(props: ProductProps) {
  const supabase = await supabaseServer();
  const params = await props.params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.product)
    .single();

  if (!product || error) return notFound();

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>{product.name}</h1>
      <p>{product.description}</p>
      <p className='text-xl font-semibold text-green-600'>{product.price} zł</p>
    </div>
  );
}
