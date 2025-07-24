import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.image ? [product.image] : (product.images || undefined),
      description: product.description || undefined
    });
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier.`,
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image || product.images?.[0] || '/api/placeholder/300/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
            {(() => {
              const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
              return isNaN(price) ? '0.00' : price.toFixed(2);
            })()}€
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}