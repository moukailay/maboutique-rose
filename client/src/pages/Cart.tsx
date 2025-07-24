import { useCartStore } from "../stores/cartStore";
import { useTranslation } from "../hooks/useTranslation";
import { ShoppingCart, Minus, Plus, X, ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";

export default function Cart() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, getTotal, getItemCount, clearCart } = useCartStore();
  const [, setLocation] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Votre panier est vide
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Découvrez nos produits naturels et commencez vos achats
            </p>
            <button
              onClick={() => setLocation("/products")}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Voir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setLocation("/products")}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuer mes achats
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mon panier
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {getItemCount()} {getItemCount() > 1 ? 'articles' : 'article'} dans votre panier
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items du panier */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center">
                  {item.images && item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-6"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {item.description && typeof item.description === 'string' && item.description.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description || ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}€
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        {/* Contrôles de quantité */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                          
                          <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                        
                        {/* Bouton supprimer */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total ligne */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Sous-total ({item.quantity} {item.quantity > 1 ? 'articles' : 'article'})
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {(() => {
                        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                        return (price * item.quantity).toFixed(2);
                      })()}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé du panier */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Résumé de commande
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Sous-total ({getItemCount()} articles)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTotal().toFixed(2)}€
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Livraison</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Gratuite
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      {getTotal().toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                <button
                  onClick={() => setLocation("/checkout")}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Procéder au paiement
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              {/* Information de sécurité */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Paiement sécurisé
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Vos données sont protégées par Stripe
                    </p>
                  </div>
                </div>
              </div>

              {/* Livraison gratuite */}
              <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-1">
                  🚚 Livraison gratuite
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  Livraison gratuite partout au Canada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}