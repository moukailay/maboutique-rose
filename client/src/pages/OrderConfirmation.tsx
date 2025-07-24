import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CheckCircle, Package, Truck, ArrowLeft, Download } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface OrderConfirmationProps {
  location: string;
}

export default function OrderConfirmation() {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Extraire l'ID de commande depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('order_id');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ['/api/orders', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Order not found');
      return response.json();
    },
    enabled: !!orderId
  });

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Commande introuvable
          </h1>
          <button
            onClick={() => setLocation("/")}
            className="text-rose-600 dark:text-rose-400 hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Commande non trouvée
          </h1>
          <button
            onClick={() => setLocation("/")}
            className="text-rose-600 dark:text-rose-400 hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de confirmation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Commande confirmée !
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Merci pour votre achat chez Rose-d'Éden
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Numéro de commande: <span className="font-mono font-bold">#{order.id}</span>
          </p>
        </div>

        {/* Statut de la commande */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statut de votre commande
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Commande reçue
                </span>
              </div>
              
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' 
                    ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  En préparation
                </span>
              </div>
              
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status === 'shipped' || order.status === 'delivered' 
                    ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Expédiée
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Détails de la commande */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Détails de la commande
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center">
                    {(item.product?.image || item.product?.images?.[0]) && (
                      <img
                        src={item.product?.image || item.product?.images?.[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.product?.name || `Produit #${item.productId}`}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Prix unitaire: {item.price}€
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Total:
                </span>
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                  {order.total}€
                </span>
              </div>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Adresse de livraison
              </h2>
              <div className="text-gray-600 dark:text-gray-300">
                <p className="font-medium">{order.customerFirstName} {order.customerLastName}</p>
                <p>{order.customerAddress}</p>
                <p>{order.customerCity}, {order.customerPostalCode}</p>
                <p>{order.customerCountry}</p>
                {order.customerPhone && <p>Tél: {order.customerPhone}</p>}
                <p>Email: {order.customerEmail}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Informations de commande
              </h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Date de commande:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode de paiement:</span>
                  <span>Carte bancaire (Stripe)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setLocation("/")}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continuer mes achats
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Imprimer la facture
              </button>
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-6 mt-8 text-center">
          <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-2">
            Merci pour votre confiance !
          </h3>
          <p className="text-rose-600 dark:text-rose-300">
            Votre commande sera traitée avec le plus grand soin. 
            Vous recevrez un email de confirmation avec les détails de suivi dès l'expédition.
          </p>
        </div>
      </div>
    </div>
  );
}