import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  phone?: string;
  total: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
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
  product?: {
    id: number;
    name: string;
    image: string;
  };
}

export default function OrderDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');

  // Fetch order details
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['/api/orders', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/orders/${id}`);
      return response.json();
    },
    enabled: !!id
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest('PUT', `/api/orders/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', id] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    }
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          text: 'En attente', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock
        };
      case 'paid':
        return { 
          text: 'Payée', 
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle
        };
      case 'shipped':
        return { 
          text: 'Expédiée', 
          color: 'bg-purple-100 text-purple-800',
          icon: Truck
        };
      case 'delivered':
        return { 
          text: 'Livrée', 
          color: 'bg-green-100 text-green-800',
          icon: Package
        };
      case 'cancelled':
        return { 
          text: 'Annulée', 
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return { 
          text: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const handleUpdateStatus = () => {
    if (statusToUpdate) {
      updateStatusMutation.mutate(statusToUpdate);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-text-medium">Commande introuvable</p>
            <Button onClick={() => setLocation('/admin/orders')} variant="outline" className="mt-4">
              Retour aux commandes
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const shippingData = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin/orders')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">Commande #{order.id}</h1>
              <p className="text-text-medium">
                Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={statusConfig.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Articles commandés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-text-dark">
                            {item.product?.name || `Produit #${item.productId}`}
                          </h3>
                          <p className="text-sm text-text-medium">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-dark">
                          {parseFloat(item.price).toFixed(2)} CAD
                        </p>
                        <p className="text-sm text-text-medium">
                          Total: {(parseFloat(item.price) * item.quantity).toFixed(2)} CAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-text-dark">{order.customerName}</p>
                  <p className="text-sm text-text-medium">{order.customerEmail}</p>
                  {order.phone && (
                    <p className="text-sm text-text-medium">{order.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {shippingData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-text-medium">
                    <p>{shippingData.address}</p>
                    <p>{shippingData.city}, {shippingData.postalCode}</p>
                    <p>{shippingData.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text-medium">Méthode:</span>
                    <span className="text-text-dark">{order.paymentMethod || 'Carte'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span className="text-rose-primary">{parseFloat(order.total).toFixed(2)} CAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Mettre à jour le statut
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={statusToUpdate} onValueChange={setStatusToUpdate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un nouveau statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={!statusToUpdate || updateStatusMutation.isPending}
                  className="w-full bg-rose-primary hover:bg-rose-light"
                >
                  {updateStatusMutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}