import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/stores/cartStore";
import { useLocation } from "wouter";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

// Charger Stripe avec la clé publique
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  clientSecret: string;
  orderData: any;
}

const CheckoutForm = ({ clientSecret, orderData }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { clearCart } = useCartStore();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order_id=${orderData.id}`,
        },
      });

      if (error) {
        toast({
          title: "Erreur de paiement",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Le paiement a réussi
        clearCart();
        toast({
          title: "Paiement réussi !",
          description: "Votre commande a été confirmée.",
        });
        setLocation(`/order-confirmation?order_id=${orderData.id}`);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Lock className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Paiement sécurisé par Stripe
          </span>
        </div>
        
        <PaymentElement 
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "paypal"]
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Traitement en cours...
          </div>
        ) : (
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payer {orderData.total}€
          </div>
        )}
      </button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        En procédant au paiement, vous acceptez nos conditions de vente.
        Vos données sont protégées par chiffrement SSL.
      </p>
    </form>
  );
};

export default function Checkout() {
  const { t } = useTranslation();
  const { items, getTotal, clearCart } = useCartStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Canada"
  });

  // Rediriger si le panier est vide
  useEffect(() => {
    if (items.length === 0) {
      setLocation("/cart");
      return;
    }
  }, [items, setLocation]);

  // Créer l'intention de paiement
  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);

      // Créer la commande avec les informations client  
      const orderItems = items.map(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return {
          productId: item.id,
          quantity: item.quantity,
          price: price.toString()
        };
      });

      const orderPayload = {
        customerInfo,
        items: orderItems,
        total: getTotal(),
        status: 'pending'
      };

      console.log("Sending payment intent request:", orderPayload);
      const response = await apiRequest("POST", "/api/create-payment-intent", orderPayload);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment intent error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Payment intent response:", data);

      if (data.clientSecret && data.order) {
        setClientSecret(data.clientSecret);
        setOrderData(data.order);
      } else {
        throw new Error("Erreur lors de la création du paiement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'intention de paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !customerInfo[field as keyof typeof customerInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    createPaymentIntent();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setLocation("/cart")}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au panier
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations de commande */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Récapitulatif de commande
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      {item.images && item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantité: {item.quantity}
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
                    {getTotal().toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de paiement */}
          <div className="space-y-6">
            {!clientSecret ? (
              // Formulaire d'informations client
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Informations de livraison
                </h2>
                
                <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Adresse *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.postalCode}
                        onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Préparation..." : "Continuer vers le paiement"}
                  </button>
                </form>
              </div>
            ) : (
              // Formulaire de paiement Stripe
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Paiement sécurisé
                </h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}