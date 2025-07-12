import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId?: number;
  sortOrder: number;
  children?: Category[];
}

export default function CategoryNavigation() {
  const [location] = useLocation();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (!categories) return null;

  // Organize categories into hierarchical structure
  const mainCategories = categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const categoriesWithChildren = mainCategories.map(mainCat => ({
    ...mainCat,
    children: categories
      .filter(cat => cat.parentId === mainCat.id)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  }));

  const isActive = (slug: string) => {
    return location.includes(`/products?category=${slug}`);
  };

  return (
    <nav className="bg-rose-50 dark:bg-gray-800 border-b border-rose-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-1 py-3">
            {categoriesWithChildren.map((category) => (
              <div key={category.id} className="relative">
                {category.children && category.children.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`h-8 px-3 text-sm font-medium transition-colors ${
                          isActive(category.slug)
                            ? 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:text-rose-600 hover:bg-rose-100 dark:hover:text-rose-400 dark:hover:bg-rose-900/20'
                        }`}
                      >
                        {category.name}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="w-full cursor-pointer"
                        >
                          Tous les {category.name}
                        </Link>
                      </DropdownMenuItem>
                      {category.children.map((child) => (
                        <DropdownMenuItem key={child.id} asChild>
                          <Link
                            href={`/products?category=${child.slug}`}
                            className="w-full cursor-pointer"
                          >
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className={`h-8 px-3 text-sm font-medium transition-colors ${
                      isActive(category.slug)
                        ? 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-rose-600 hover:bg-rose-100 dark:hover:text-rose-400 dark:hover:bg-rose-900/20'
                    }`}
                  >
                    <Link href={`/products?category=${category.slug}`}>
                      {category.name}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}