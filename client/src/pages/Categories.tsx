import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Leaf, 
  Heart, 
  User, 
  Star, 
  Sparkles, 
  Droplets, 
  ShoppingBag,
  Tag
} from 'lucide-react';
import type { Category } from '@shared/schema';

export default function Categories() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filtrer pour ne montrer que les catégories principales (pas les sous-catégories)
  const mainCategories = categories?.filter(cat => !cat.parentId) || [];

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    switch(name) {
      case 'tisanes':
        return <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />;
      case 'femmes':
        return <Heart className="w-8 h-8 text-rose-600 dark:text-rose-400" />;
      case 'hommes':
        return <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
      case 'rose-d\'éden':
        return <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />;
      case 'produits amincissants':
        return <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />;
      case 'huiles et beurres':
        return <Droplets className="w-8 h-8 text-amber-600 dark:text-amber-400" />;
      case 'autres produits':
        return <ShoppingBag className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
      case 'lingerie rose-d\'éden':
        return <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />;
      case 'rose-d\'éden déo / parfums':
        return <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
      case 'accessoires':
        return <ShoppingBag className="w-8 h-8 text-teal-600 dark:text-teal-400" />;
      case 'solde':
        return <Tag className="w-8 h-8 text-red-600 dark:text-red-400" />;
      default:
        return <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />;
    }
  };

  const getCategoryImage = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    switch(name) {
      case 'tisanes':
        return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format';
      case 'femmes':
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format';
      case 'hommes':
        return 'https://images.unsplash.com/photo-1506629905717-49b6cc13b76c?w=800&h=600&fit=crop&auto=format';
      case 'rose-d\'éden':
        return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop&auto=format';
      case 'produits amincissants':
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format';
      case 'huiles et beurres':
        return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=600&fit=crop&auto=format';
      case 'autres produits':
        return 'https://images.unsplash.com/photo-1596040969280-1e4a7df8c1a2?w=800&h=600&fit=crop&auto=format';
      case 'lingerie rose-d\'éden':
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format';
      case 'rose-d\'éden déo / parfums':
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format';
      case 'accessoires':
        return 'https://images.unsplash.com/photo-1596040969280-1e4a7df8c1a2?w=800&h=600&fit=crop&auto=format';
      case 'solde':
        return 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=600&fit=crop&auto=format';
      default:
        return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format';
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    console.log('Navigating to category:', categoryId);
    // Force navigation with window.location to ensure URL parameters are preserved
    window.location.href = `/products?category=${categoryId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded max-w-md mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            TOUTES LES CATÉGORIES
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre gamme complète de produits naturels ROSE-D'ÉDEN organisés par catégories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800 border-0 shadow-lg"
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={getCategoryImage(category.name)} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Icon overlay */}
                <div className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg">
                  {getCategoryIcon(category.name)}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {category.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium mr-2">Explorer</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}