import { Link } from 'wouter';
import { ArrowRight, Leaf, Tag, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@shared/schema';

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  const { t } = useTranslation();

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Product Images Mosaic Background */}
        <div className="absolute inset-0 grid grid-cols-8 gap-1 p-2">
          {/* Diverse people images */}
          {[
            'https://images.unsplash.com/photo-1494790108755-2616c353f4f3?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop',
          ].map((imageUrl, index) => (
            <div
              key={`person-${index}`}
              className="aspect-square bg-cover bg-center rounded-lg opacity-30 hover:opacity-50 transition-opacity duration-300"
              style={{
                backgroundImage: `url(${imageUrl})`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
          
          {/* Product images */}
          {products?.slice(0, 20).map((product, index) => (
            <div
              key={`bg-${product.id}-${index}`}
              className="aspect-square bg-cover bg-center rounded-lg opacity-25 hover:opacity-45 transition-opacity duration-300"
              style={{
                backgroundImage: `url(${product.image})`,
                animationDelay: `${(index + 8) * 0.1}s`,
              }}
            />
          ))}
          
          {/* Natural products themed images */}
          {[
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1596040969280-1e4a7df8c1a2?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
          ].map((imageUrl, index) => (
            <div
              key={`natural-${index}`}
              className="aspect-square bg-cover bg-center rounded-lg opacity-20 hover:opacity-40 transition-opacity duration-300"
              style={{
                backgroundImage: `url(${imageUrl})`,
                animationDelay: `${(index + 28) * 0.15}s`,
              }}
            />
          ))}
          
          {/* Fill remaining spots with gradient */}
          {Array.from({ length: Math.max(0, 64 - 8 - (products?.length || 0) - 6) }, (_, i) => (
            <div
              key={`gradient-${i}`}
              className="aspect-square bg-gradient-to-br from-rose-500/15 to-pink-600/15 rounded-lg opacity-10"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-gray-900/50" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-rose-primary hover:bg-rose-light text-white px-8 py-4 text-lg">
              {t('home.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-text-light mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-lg text-text-medium dark:text-text-medium max-w-2xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-rose-primary text-rose-primary hover:bg-rose-primary hover:text-white">
                {t('home.featured.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-8 lg:mb-0">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Agriculture durable"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-text-light mb-6">
                {t('home.about.title')}
              </h2>
              <p className="text-lg text-text-medium dark:text-text-medium mb-6">
                {t('home.about.text')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Leaf className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark dark:text-text-light font-medium">{t('home.about.eco')}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark dark:text-text-light font-medium">{t('home.about.quality')}</span>
                </div>
                <div className="flex items-center">
                  <Handshake className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark dark:text-text-light font-medium">{t('home.about.social')}</span>
                </div>
              </div>
              
              <Link href="/about">
                <Button className="bg-rose-primary hover:bg-rose-light">
                  {t('home.about.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
