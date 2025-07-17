import { Link } from 'wouter';
import { ArrowRight, Leaf, Tag, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@shared/schema';
import heroImage from '@assets/imgBG2_1752354555706.png';

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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        {/* Floating Products */}
        <div className="absolute inset-0 z-5">
          {featuredProducts.slice(0, 3).map((product, index) => (
            <div
              key={`floating-${product.id}`}
              className={`absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/95 shadow-2xl flex items-center justify-center animate-pulse hover:scale-125 transition-all duration-500 cursor-pointer ${
                index === 0 ? 'top-1/4 right-1/5 md:right-1/4' : 
                index === 1 ? 'bottom-1/4 right-1/6 md:right-1/5' : 
                'top-1/2 right-1/12 md:right-1/6'
              }`}
              style={{
                animationDelay: `${index * 0.8}s`,
                animationDuration: '2.5s'
              }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 bg-cover bg-center rounded-full border-2 border-rose-200"
                style={{
                  backgroundImage: `url(${product.image})`,
                }}
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto drop-shadow-lg">
            {t('home.hero.subtitle')}
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-rose-primary hover:bg-rose-light text-white px-8 py-4 text-lg shadow-xl">
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

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
