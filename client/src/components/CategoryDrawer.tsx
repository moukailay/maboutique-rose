import { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Leaf, Heart, User, Sparkles, Droplets, ShoppingBag, Tag, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId?: number;
  sortOrder: number;
  children?: Category[];
}

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryDrawer({ isOpen, onClose }: CategoryDrawerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      // Organiser les catégories par hiérarchie
      const categoryMap = new Map<number, Category>();
      data.forEach((cat: Category) => {
        categoryMap.set(cat.id, { ...cat, children: [] });
      });

      const rootCategories: Category[] = [];
      data.forEach((cat: Category) => {
        const category = categoryMap.get(cat.id)!;
        if (cat.parentId) {
          const parent = categoryMap.get(cat.parentId);
          if (parent) {
            parent.children!.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      // Trier par sortOrder
      rootCategories.sort((a, b) => a.sortOrder - b.sortOrder);
      rootCategories.forEach(cat => {
        if (cat.children) {
          cat.children.sort((a, b) => a.sortOrder - b.sortOrder);
        }
      });

      setCategories(rootCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (slug: string) => {
    setLocation(`/products?category=${slug}`);
    onClose();
  };

  const handleAllProductsClick = () => {
    setLocation('/products');
    onClose();
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    switch(name) {
      case 'tisanes':
        return <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'femmes':
        return <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'hommes':
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'rose-d\'éden':
        return <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'produits amincissants':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'huiles et beurres':
        return <Droplets className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'autres produits':
        return <ShoppingBag className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      case 'lingerie rose-d\'éden':
        return <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
      case 'rose-d\'éden déo / parfums':
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'accessoires':
        return <ShoppingBag className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'solde':
        return <Tag className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'produits intimes':
        return <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
      case 'secrets de femmes':
        return <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      case 'produits de corps':
        return <Droplets className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      default:
        return <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-rose-600 dark:text-rose-400">
            {t('categories')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Tous les produits */}
          <button
            onClick={handleAllProductsClick}
            className="w-full text-left p-3 mb-4 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors group border-2 border-rose-100 dark:border-rose-800/50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-800/30 transition-colors">
                <ShoppingBag className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                {t('all_products')}
              </span>
            </div>
          </button>

          {/* Catégories */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="space-y-1">
                {/* Catégorie principale */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="flex-1 text-left p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg group-hover:bg-rose-200 dark:group-hover:bg-rose-800/30 transition-colors">
                        {getCategoryIcon(category.name)}
                      </div>
                      <div className="flex-1">
                        <span className="text-base font-medium text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          {category.name}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Bouton d'expansion si il y a des sous-catégories */}
                  {category.children && category.children.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <ChevronRight 
                        size={16} 
                        className={`text-gray-400 transition-transform ${
                          expandedCategories.includes(category.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Sous-catégories */}
                {category.children && category.children.length > 0 && expandedCategories.includes(category.id) && (
                  <div className="ml-4 space-y-1 border-l-2 border-rose-100 dark:border-rose-800/50 pl-4">
                    {category.children.map((subCategory) => (
                      <button
                        key={subCategory.id}
                        onClick={() => handleCategoryClick(subCategory.slug)}
                        className="w-full text-left p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-rose-50 dark:bg-rose-900/10 rounded group-hover:bg-rose-100 dark:group-hover:bg-rose-800/20 transition-colors">
                            {getCategoryIcon(subCategory.name)}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                              {subCategory.name}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {subCategory.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}