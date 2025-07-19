import { Link } from 'wouter';
import { ArrowRight, Leaf, Tag, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import HeroCarousel from '@/components/HeroCarousel';
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
      {/* Hero Section with Carousel - Full Width */}
      <section className="w-full">
        <HeroCarousel />
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
