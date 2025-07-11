import { Link } from 'wouter';
import { ArrowRight, Leaf, Tag, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@shared/schema';

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Bienvenue chez ROSE-D'ÉDEN
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Votre source de produits naturels authentiques et responsables.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-rose-primary hover:bg-rose-light text-white px-8 py-4 text-lg">
              Découvrir nos produits
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
              Nos produits naturels vedettes
            </h2>
            <p className="text-lg text-text-medium max-w-2xl mx-auto">
              Découvrez notre sélection de produits naturels soigneusement choisis pour leur qualité et leur authenticité.
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
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
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
              <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-6">
                Notre engagement pour la nature
              </h2>
              <p className="text-lg text-text-medium mb-6">
                Depuis plus de 10 ans, nous nous engageons à vous offrir des produits naturels d'exception, 
                sélectionnés avec soin auprès de producteurs locaux et responsables.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Leaf className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark font-medium">Engagement écologique et durable</span>
                </div>
                <div className="flex items-center">
                  <Tag className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark font-medium">Origine et qualité garanties</span>
                </div>
                <div className="flex items-center">
                  <Handshake className="text-rose-primary mr-3 h-5 w-5" />
                  <span className="text-text-dark font-medium">Responsabilité sociale</span>
                </div>
              </div>
              
              <Link href="/about">
                <Button className="bg-rose-primary hover:bg-rose-light">
                  En savoir plus
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
