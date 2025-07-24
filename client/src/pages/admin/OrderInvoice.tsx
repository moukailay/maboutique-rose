import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';

interface OrderDetail {
  id: number;
  customerName: string;
  customerEmail: string;
  phone?: string;
  total: string;
  status: string;
  shippingAddress?: string;
  paymentMethod?: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    name: string;
    image: string;
  };
}

export default function OrderInvoice() {
  // Get order ID from URL
  const pathParts = window.location.pathname.split('/');
  const orderId = parseInt(pathParts[pathParts.length - 2]); // .../orders/{id}/invoice

  // Fetch order details
  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ['/api/orders', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    }
  });

  if (isLoading || !order) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
  const subtotal = order.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Company Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-4xl font-bold text-rose-600 mb-2">ROSE-D'ÉDEN</h1>
        <p className="text-lg text-gray-600">Produits Naturels de Qualité</p>
        <p className="text-sm text-gray-500 mt-2">
          contact@rose-d-eden.fr | +1 (514) 555-0123
        </p>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">FACTURE</h2>
          <div className="space-y-1">
            <p><strong>Numéro:</strong> #{order.id.toString().padStart(6, '0')}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Statut:</strong> {order.status}</p>
          </div>
        </div>
        
        <div className="text-right">
          <h3 className="font-bold mb-2">Facturé à:</h3>
          <div className="space-y-1">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            {order.phone && <p>{order.phone}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="mb-8">
          <h3 className="font-bold mb-2">Adresse de livraison:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p>{order.customerName}</p>
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2">Article</th>
              <th className="text-center py-3 px-2">Quantité</th>
              <th className="text-right py-3 px-2">Prix unitaire</th>
              <th className="text-right py-3 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-2">
                  <div className="font-medium">{item.product.name}</div>
                </td>
                <td className="text-center py-3 px-2">{item.quantity}</td>
                <td className="text-right py-3 px-2">{parseFloat(item.price).toFixed(2)} CAD</td>
                <td className="text-right py-3 px-2 font-medium">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} CAD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Sous-total:</span>
              <span>{subtotal.toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Livraison:</span>
              <span>Gratuite</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total:</span>
              <span>{parseFloat(order.total).toFixed(2)} CAD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gray-50 p-4 rounded mb-8">
        <h3 className="font-bold mb-2">Informations de paiement:</h3>
        <p><strong>Méthode:</strong> {order.paymentMethod || 'Carte de crédit'}</p>
        <p><strong>Statut:</strong> {order.status === 'paid' || order.status === 'shipped' || order.status === 'in-transit' || order.status === 'delivered' ? 'Payé' : 'En attente'}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-6">
        <p>Merci pour votre confiance en ROSE-D'ÉDEN</p>
        <p className="mt-2">
          Cette facture a été générée électroniquement le {new Date().toLocaleDateString('fr-FR')}
        </p>
        <p className="mt-2">
          Pour toute question, contactez-nous à contact@rose-d-eden.fr
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}