export interface Product {
  id: number;
  name: string;
  price: number;
  original_price: number | null;
  delivery_days: string;
  category: string;
  brand: string;
  image_url: string | null;
  badge: string | null;
  in_stock: boolean;
  description?: string;
}

export interface CartToastState {
  isVisible: boolean;
  productName: string;
}

export interface ShopState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  filtersLoading: boolean;
  searchQuery: string;
  priceRange: [number, number];
  selectedCategories: string[];
  selectedBrands: string[];
  categories: string[];
  brands: string[];
  cartToast: CartToastState;
  cartItemCount: number;
}

export type ShopAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FILTERS_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'TOGGLE_BRAND'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SHOW_CART_TOAST'; payload: string }
  | { type: 'HIDE_CART_TOAST' }
  | { type: 'INCREMENT_CART' };
