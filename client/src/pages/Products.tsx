import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product, Category } from '@shared/schema';

export default function Products() {
  const [location] = useLocation();
  
  // Get URL parameters from window.location instead of wouter location
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search') || '';
  const categoryFilter = urlParams.get('category') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const { t } = useTranslation();

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch) params.append('search', localSearch);
    if (categoryFilter) params.append('category', categoryFilter);
    
    window.history.pushState({}, '', `/products?${params}`);
    window.location.reload();
  };

  const handleCategoryFilter = (categoryId: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (categoryId !== 'all') params.append('category', categoryId);
    
    window.history.pushState({}, '', `/products?${params}`);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-text-light mb-4">
            {categoryFilter ? 
              `${categories?.find(c => c.id.toString() === categoryFilter)?.name || 'Catégorie'} - ${t('products.title')}` : 
              t('products.title')
            }
          </h1>
          <p className="text-lg text-text-medium dark:text-text-medium">
            {categoryFilter ? 
              `Découvrez nos produits dans la catégorie ${categories?.find(c => c.id.toString() === categoryFilter)?.name || 'sélectionnée'}` : 
              t('home.featured.subtitle')
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input
              type="text"
              placeholder={t('products.search')}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </form>
          
          {categoryFilter ? (
            <Button
              onClick={() => window.location.href = '/categories'}
              className="bg-rose-primary hover:bg-rose-light text-white"
            >
              ← Retour aux catégories
            </Button>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={categoryFilter === '' ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter('')}
                className={categoryFilter === '' ? 'bg-rose-primary hover:bg-rose-light' : ''}
              >
                {t('products.filter.all')}
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilter === category.id.toString() ? 'default' : 'outline'}
                  onClick={() => handleCategoryFilter(category.id.toString())}
                  className={categoryFilter === category.id.toString() ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-medium dark:text-text-medium text-lg">
              {searchQuery || categoryFilter 
                ? t('products.empty')
                : t('products.loading')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
