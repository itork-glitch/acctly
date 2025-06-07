'use client';

import React, { useEffect, useMemo } from 'react';
import { Product } from '@/types/shop';
import { useShopReducer } from '@/hooks/useShopReducer';
import {
  Header,
  FiltersSidebar,
  ProductCard,
  ProductSkeleton,
} from '@/components/shop/ShopComponents';
import { CartToast } from '@/components/shop/CartToast';
import { FloatingCart } from '@/components/shop/FloatingCart';

interface ShopClientProps {
  initialProducts: Product[];
  initialCategories: string[];
  initialBrands: string[];
  searchParams: { [key: string]: string | string[] | undefined };
}

const ShopClient: React.FC<ShopClientProps> = ({
  initialProducts,
  initialCategories,
  initialBrands,
  searchParams,
}) => {
  const { state, actions } = useShopReducer();

  useEffect(() => {
    actions.setProducts(initialProducts);
    actions.setCategories(initialCategories);
    actions.setBrands(initialBrands);

    const maxPrice = Math.max(...initialProducts.map((p) => p.price));
    actions.setPriceRange([0, maxPrice]);

    actions.setLoading(false);
    actions.setFiltersLoading(false);
  }, [initialProducts, initialCategories, initialBrands]);

  useEffect(() => {
    if (searchParams.q && typeof searchParams.q === 'string')
      actions.setSearchQuery(searchParams.q);

    if (searchParams.category && typeof searchParams.category === 'string')
      actions.toggleCategory(searchParams.category);
  }, [searchParams]);

  const displayProducts = useMemo(() => {
    let filtered = state.filteredProducts;

    if (state.searchQuery.trim()) {
      const searchLower = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [state.filteredProducts, state.searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearchQuery(e.target.value);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    actions.setPriceRange(range);
  };

  const handleCategoryChange = (category: string) => {
    actions.toggleCategory(category);
  };

  const handleBrandChange = (brand: string) => {
    actions.toggleBrand(brand);
  };

  const handleAddToCart = (productName: string) => {
    actions.incrementCart();
    actions.showCartToast(productName);
  };

  const handleCartToastClose = () => {
    actions.hideCartToast();
  };

  const handleFloatingCartClick = () => {
    // You can implement cart modal/page navigation here
    console.log('Open cart with', state.cartItemCount, 'items');
  };

  const maxPrice = useMemo(() => {
    return Math.max(...state.products.map((p) => p.price)) || 1000;
  }, [state.products]);

  return (
    <div className='min-h-screen bg-[#111111] text-white'>
      {/* Header */}
      <Header
        searchQuery={state.searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='flex gap-8'>
          {/* Filters Sidebar */}
          <FiltersSidebar
            filtersLoading={state.filtersLoading}
            priceRange={state.priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            maxPrice={maxPrice}
            categories={state.categories}
            selectedCategories={state.selectedCategories}
            onCategoryChange={handleCategoryChange}
            brands={state.brands}
            selectedBrands={state.selectedBrands}
            onBrandChange={handleBrandChange}
          />

          {/* Products Grid */}
          <main className='flex-1'>
            {/* Results Header */}
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h1 className='text-2xl font-bold'>
                  {state.searchQuery
                    ? `Results for "${state.searchQuery}"`
                    : 'All Products'}
                </h1>
                <p className='text-gray-400 mt-1'>
                  {displayProducts.length} product
                  {displayProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Active Filters */}
              {(state.selectedCategories.length > 0 ||
                state.selectedBrands.length > 0) && (
                <div className='flex flex-wrap gap-2'>
                  {state.selectedCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className='px-3 py-1 bg-primary/20 text-primary text-sm rounded-full hover:bg-primary/30 transition-colors'>
                      {category} ×
                    </button>
                  ))}
                  {state.selectedBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandChange(brand)}
                      className='px-3 py-1 bg-primary/20 text-primary text-sm rounded-full hover:bg-primary/30 transition-colors'>
                      {brand} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {state.loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {[...Array(8)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-16'>
                <div className='text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-semibold mb-2'>
                  No products found
                </h3>
                <p className='text-gray-400 mb-4'>
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    actions.setSearchQuery('');
                    state.selectedCategories.forEach(actions.toggleCategory);
                    state.selectedBrands.forEach(actions.toggleBrand);
                    actions.setPriceRange([0, maxPrice]);
                  }}
                  className='px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors'>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart Toast */}
      <CartToast
        isVisible={state.cartToast.isVisible}
        productName={state.cartToast.productName}
        onClose={handleCartToastClose}
      />

      {/* Floating Cart */}
      <FloatingCart
        itemCount={state.cartItemCount}
        onClick={handleFloatingCartClick}
      />
    </div>
  );
};

export default ShopClient;
