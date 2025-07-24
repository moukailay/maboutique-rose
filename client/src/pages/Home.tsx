import { Link } from 'wouter';
import { ArrowRight, Leaf, Tag, Handshake, Grid, Sparkles } from 'lucide-react';
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

      {/* Categories CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950 dark:via-pink-950 dark:to-purple-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-rose-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300">
              <Grid className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.categories.title') || 'Explorez Toutes Nos Catégories'}
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {t('home.categories.subtitle') || 'Découvrez notre gamme complète de produits naturels organisés par catégories pour faciliter votre recherche.'}
            </p>
          </div>
          
          {/* Main CTA Button */}
          <Link href="/categories">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-12 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-0"
            >
              <Grid className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              {t('home.categories.cta') || 'Voir Toutes les Catégories'}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
          
          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t('home.categories.feature1') || 'Produits Naturels'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  {t('home.categories.feature1_desc') || '100% bio et naturel'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t('home.categories.feature2') || 'Qualité Premium'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  {t('home.categories.feature2_desc') || 'Sélection rigoureuse'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                <Tag className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t('home.categories.feature3') || 'Prix Équitables'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  {t('home.categories.feature3_desc') || 'Meilleur rapport qualité-prix'}
                </p>
              </div>
            </div>
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
