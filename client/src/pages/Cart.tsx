import { Link } from 'wouter';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/lib/cart';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-text-dark mb-4">
              Votre panier est vide
            </h1>
            <p className="text-lg text-text-medium mb-8">
              Découvrez nos produits naturels et ajoutez-les à votre panier.
            </p>
            <Link href="/products">
              <Button className="bg-forest-green hover:bg-forest-light">
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-2">
            Votre Panier
          </h1>
          <p className="text-lg text-text-medium">
            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark text-lg">
                        {item.name}
                      </h3>
                      <p className="text-forest-green font-bold text-lg">
                        {item.price} €
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-text-dark text-lg">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-text-dark">
                  Résumé de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-medium">Sous-total</span>
                    <span className="font-medium">{getTotalPrice().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-medium">Livraison</span>
                    <span className="font-medium text-forest-green">Gratuite</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-text-dark">Total</span>
                      <span className="text-lg font-bold text-forest-green">
                        {getTotalPrice().toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full bg-forest-green hover:bg-forest-light">
                      Procéder au paiement
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continuer mes achats
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="w-full text-red-500 hover:text-red-700"
                  >
                    Vider le panier
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-text-dark mb-2">
                    Livraison gratuite
                  </h4>
                  <p className="text-sm text-text-medium">
                    Profitez de la livraison gratuite sur toutes vos commandes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
