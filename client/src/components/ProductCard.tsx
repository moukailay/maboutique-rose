import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier.`,
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-text-dark mb-2 hover:text-rose-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-text-medium text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-rose-primary">
            {product.price} CAD
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-rose-primary hover:bg-rose-light text-white"
          >
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
