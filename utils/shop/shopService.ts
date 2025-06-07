import { supabase } from '@/utils/supabase/client';
import { Product } from '@/types/shop';

export class ShopService {
  static async fetchProducts(searchTerm?: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm && searchTerm.trim())
        query = query.ilike('name', `%${searchTerm}`);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products: ', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching products: ', error);
      throw error;
    }
  }

  static async fetchFiltersData(): Promise<{
    categories: string[];
    brands: string[];
  }> {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        supabase
          .from('products')
          .select('category')
          .not('category', 'is', null),
        supabase.from('products').select('brand').not('brand', 'is', null),
      ]);

      const categories = categoriesResponse.data
        ? [...new Set(categoriesResponse.data.map((item) => item.category))]
        : [];

      const brands = brandsResponse.data
        ? [...new Set(brandsResponse.data.map((item) => item.brand))]
        : [];

      return { categories, brands };
    } catch (error) {
      console.error('Error fetching filters data: ', error);
      throw error;
    }
  }

  static async getProductsForSSR(): Promise<{
    products: Product[];
    categories: string[];
    brands: string[];
  }> {
    try {
      const [products, filtersData] = await Promise.all([
        this.fetchProducts(),
        this.fetchFiltersData(),
      ]);

      return {
        products,
        categories: filtersData.categories,
        brands: filtersData.brands,
      };
    } catch (error) {
      console.error('Error fetching data for SSR', error);
      return {
        products: [],
        categories: [],
        brands: [],
      };
    }
  }
}
