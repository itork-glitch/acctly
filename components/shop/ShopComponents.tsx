import { Search, User, ShoppingCart, Filter, Truck, Heart } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/shop';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Product Card Skeleton Component
export const ProductSkeleton = () => (
  <Card className='bg-[#212121] border-[#414141] overflow-hidden p-2'>
    <CardContent className='p-0'>
      <Skeleton className='w-full h-64 bg-[#414141]' />
      <div className='p-4 space-y-3'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-3/4 bg-[#414141]' />
          <Skeleton className='h-3 w-1/2 bg-[#414141]' />
        </div>
        <Skeleton className='h-4 w-2/3 bg-[#414141]' />
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-20 bg-[#414141]' />
          <Skeleton className='h-4 w-16 bg-[#414141]' />
        </div>
        <Skeleton className='h-10 w-full bg-[#414141]' />
      </div>
    </CardContent>
  </Card>
);

// Filters Skeleton Component
export const FiltersSkeleton = () => (
  <div className='bg-[#212121] rounded-lg p-6 border border-[#414141]'>
    <div className='flex items-center gap-2 mb-4'>
      <Filter className='h-5 w-5 text-primary' />
      <h2 className='text-lg font-semibold'>Filters</h2>
    </div>
    <div className='space-y-4'>
      <div>
        <Skeleton className='h-4 w-24 bg-[#414141] mb-2' />
        <Skeleton className='h-6 w-full bg-[#313131]' />
      </div>
      <Separator className='bg-[#414141]' />
      <div>
        <Skeleton className='h-4 w-20 bg-[#313131] mb-2' />
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-4 w-4 bg-[#313131]' />
              <Skeleton className='h-4 w-20 bg-[#313131]' />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Header Component
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => (
  <header className='sticky top-0 z-50 border-b border-gray-700 bg-[#111111]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111111]/60'>
    <div className='container mx-auto px-4 py-4'>
      <div className='flex items-center justify-between gap-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.png' alt='Acctly logo' height={36} width={36} />
          <span className='text-xl font-bold'>Acctly</span>
        </Link>

        {/* Search Bar */}
        <div className='flex-1 max-w-2xl mx-8'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
            <Input
              placeholder='Search for products...'
              value={searchQuery}
              onChange={onSearchChange}
              className='w-full pl-12 pr-4 py-3 bg-gray-800 border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-primary focus:ring-primary transition-all duration-300'
            />
          </div>
        </div>

        {/* Account & Cart */}
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-gray-300 hover:text-white hover:bg-gray-800'>
            <ShoppingCart className='h-5 w-5' />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-300 hover:text-white hover:bg-gray-800'>
                <User className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='bg-gray-800 border-gray-600'>
              <DropdownMenuItem className='text-gray-300 hover:text-white hover:bg-gray-700'>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className='text-gray-300 hover:text-white hover:bg-gray-700'>
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem className='text-gray-300 hover:text-white hover:bg-gray-700'>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className='text-gray-300 hover:text-white hover:bg-gray-700'>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
);

// Filters Sidebar Component
interface FiltersSidebarProps {
  filtersLoading: boolean;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
}

export const FiltersSidebar = ({
  filtersLoading,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  categories,
  selectedCategories,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandChange,
}: FiltersSidebarProps) => (
  <aside className='w-80 space-y-6'>
    {filtersLoading ? (
      <FiltersSkeleton />
    ) : (
      <div className='bg-[#212121] rounded-lg p-6 border border-[#414141]'>
        <div className='flex items-center gap-2 mb-4'>
          <Filter className='h-5 w-5 text-primary' />
          <h2 className='text-lg font-semibold'>Filters</h2>
        </div>

        <div className='space-y-4'>
          {/* Price Range */}
          <div>
            <Label className='text-sm font-medium text-gray-300'>
              Price Range
            </Label>
            <div className='mt-2'>
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={maxPrice}
                step={1}
                className='w-full'
              />
              <div className='flex justify-between text-sm text-gray-400 mt-1'>
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator className='bg-gray-600' />

          {/* Categories */}
          <div>
            <Label className='text-sm font-medium text-gray-300'>
              Categories
            </Label>
            <div className='mt-2 space-y-2'>
              {categories.map((category) => (
                <div key={category} className='flex items-center space-x-2'>
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                    className='border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  />
                  <Label
                    htmlFor={category}
                    className='text-sm text-gray-300 cursor-pointer'>
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className='bg-gray-600' />

          {/* Brands */}
          <div>
            <Label className='text-sm font-medium text-gray-300'>Brands</Label>
            <div className='mt-2 space-y-2'>
              {brands.slice(0, 8).map((brand) => (
                <div key={brand} className='flex items-center space-x-2'>
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => onBrandChange(brand)}
                    className='border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  />
                  <Label
                    htmlFor={brand}
                    className='text-sm text-gray-300 cursor-pointer'>
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </aside>
);

// Product Card Component
interface ProductCardProps {
  product: Product;
  onAddToCart: (productName: string) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => (
  <Card className='bg-[#212121] border-[#414141] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500 group overflow-hidden hover:-translate-y-1 hover:scale-[1.02]'>
    <CardContent className='p-0'>
      <div className='relative'>
        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          width={300}
          height={300}
          className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
        />
        {product.badge && (
          <Badge className='absolute top-3 left-3 bg-primary hover:bg-primary/90'>
            {product.badge}
          </Badge>
        )}
        <Button
          size='icon'
          variant='ghost'
          className='absolute top-3 right-3 bg-gray-800/80 hover:bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition-opacity'>
          <Heart className='h-4 w-4' />
        </Button>
        {!product.in_stock && (
          <div className='absolute inset-0 bg-gray-800/80 flex items-center justify-center'>
            <span className='text-white font-semibold'>Out of Stock</span>
          </div>
        )}
      </div>

      <div className='p-4 space-y-3'>
        <div>
          <h3 className='font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors'>
            {product.name}
          </h3>
          <p className='text-sm text-gray-400'>{product.brand}</p>
        </div>

        <div className='flex items-center gap-2'>
          <Truck className='h-4 w-4 text-primary' />
          <span className='text-sm text-gray-300'>
            Delivery in {product.delivery_days}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-bold text-white'>
              ${product.price}
            </span>
            {product.original_price &&
              product.original_price > product.price && (
                <span className='text-sm text-gray-500 line-through'>
                  ${product.original_price}
                </span>
              )}
          </div>
        </div>

        <Button
          className='w-full bg-primary hover:bg-primary/90 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-95'
          disabled={!product.in_stock}
          onClick={() => onAddToCart(product.name)}>
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </CardContent>
  </Card>
);
