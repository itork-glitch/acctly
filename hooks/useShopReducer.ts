import { useReducer, useMemo } from 'react';
import { ShopState, ShopAction, Product } from '@/types/shop';

const initialState: ShopState = {
  products: [],
  filteredProducts: [],
  loading: true,
  filtersLoading: true,
  searchQuery: '',
  priceRange: [0, 1000],
  selectedCategories: [],
  selectedBrands: [],
  categories: [],
  brands: [],
  cartToast: {
    isVisible: false,
    productName: '',
  },
  cartItemCount: 0,
};

function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'SET_FILTERED_PRODUCTS':
      return { ...state, filteredProducts: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_FILTERS_LOADING':
      return { ...state, filtersLoading: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };

    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.payload)
          ? state.selectedCategories.filter((c) => c !== action.payload)
          : [...state.selectedCategories, action.payload],
      };
    case 'TOGGLE_BRAND':
      return {
        ...state,
        selectedBrands: state.selectedBrands.includes(action.payload)
          ? state.selectedBrands.filter((b) => b !== action.payload)
          : [...state.selectedBrands, action.payload],
      };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_BRANDS':
      return { ...state, brands: action.payload };

    case 'SHOW_CART_TOAST':
      return {
        ...state,
        cartToast: { isVisible: true, productName: action.payload },
      };

    case 'HIDE_CART_TOAST':
      return {
        ...state,
        cartToast: { isVisible: false, productName: '' },
      };

    case 'INCREMENT_CART':
      return { ...state, cartItemCount: state.cartItemCount + 1 };

    default:
      return state;
  }
}

export const useShopReducer = () => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Memoized filtered products logic
  const filteredProducts = useMemo(() => {
    let filtered = state.products;

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= state.priceRange[0] &&
        product.price <= state.priceRange[1]
    );

    // Filter by categories
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        state.selectedCategories.includes(product.category)
      );
    }

    // Filter by brands
    if (state.selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        state.selectedBrands.includes(product.brand)
      );
    }

    return filtered;
  }, [
    state.products,
    state.priceRange,
    state.selectedCategories,
    state.selectedBrands,
  ]);

  // Actions
  const actions = {
    setProducts: (products: Product[]) =>
      dispatch({ type: 'SET_PRODUCTS', payload: products }),

    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),

    setFiltersLoading: (loading: boolean) =>
      dispatch({ type: 'SET_FILTERS_LOADING', payload: loading }),

    setSearchQuery: (query: string) =>
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),

    setPriceRange: (range: [number, number]) =>
      dispatch({ type: 'SET_PRICE_RANGE', payload: range }),

    toggleCategory: (category: string) =>
      dispatch({ type: 'TOGGLE_CATEGORY', payload: category }),

    toggleBrand: (brand: string) =>
      dispatch({ type: 'TOGGLE_BRAND', payload: brand }),

    setCategories: (categories: string[]) =>
      dispatch({ type: 'SET_CATEGORIES', payload: categories }),

    setBrands: (brands: string[]) =>
      dispatch({ type: 'SET_BRANDS', payload: brands }),

    showCartToast: (productName: string) =>
      dispatch({ type: 'SHOW_CART_TOAST', payload: productName }),

    hideCartToast: () => dispatch({ type: 'HIDE_CART_TOAST' }),

    incrementCart: () => dispatch({ type: 'INCREMENT_CART' }),
  };

  return {
    state: { ...state, filteredProducts },
    actions,
  };
};
