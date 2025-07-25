import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  Printer,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface OrderDetail {
  id: number;
  customerName: string;
  customerEmail: string;
  phone?: string;
  total: string;
  status: 'pending' | 'paid' | 'shipped' | 'in-transit' | 'delivered' | 'cancelled';
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
    images: string[];
  };
}

export default function OrderDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get order ID from URL
  const pathParts = window.location.pathname.split('/');
  const orderId = parseInt(pathParts[pathParts.length - 1]);

  // Fetch order details
  const { data: order, isLoading, error } = useQuery<OrderDetail>({
    queryKey: ['/api/orders', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès.",
      });
    },
    onError: () => {
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
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock
        };
      case 'paid':
        return { 
          text: 'Payée', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircle
        };
      case 'shipped':
        return { 
          text: 'Expédiée', 
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Truck
        };
      case 'in-transit':
        return { 
          text: 'En route', 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Truck
        };
      case 'delivered':
        return { 
          text: 'Livrée', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Package
        };
      case 'cancelled':
        return { 
          text: 'Annulée', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle
        };
      default:
        return { 
          text: status, 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock
        };
    }
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open(`/admin/orders/${orderId}/invoice`, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const getNextStatusOptions = (status: string) => {
    switch (status) {
      case 'pending':
        return [{ value: 'paid', label: 'Marquer comme payée', icon: CheckCircle }];
      case 'paid':
        return [{ value: 'shipped', label: 'Marquer comme expédiée', icon: Truck }];
      case 'shipped':
        return [{ value: 'in-transit', label: 'Marquer en route', icon: Truck }];
      case 'in-transit':
        return [{ value: 'delivered', label: 'Marquer comme livrée', icon: Package }];
      default:
        return [];
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
            <p className="text-text-medium">Commande non trouvée</p>
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
  const nextStatusOptions = getNextStatusOptions(order.status);
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;

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
                Créée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrintInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer facture
            </Button>
            <Badge className={`${statusConfig.color} px-3 py-1 text-sm font-medium`}>
              <StatusIcon className="mr-1 h-4 w-4" />
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Articles commandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.images?.[0]?.startsWith('/api/') ? item.product.images[0] : `/api/uploads/${item.product.images?.[0]?.split('/').pop() || 'default.jpg'}`}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&auto=format';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-text-dark">{item.product.name}</h3>
                        <p className="text-sm text-text-medium">Quantité: {item.quantity}</p>
                        <p className="text-sm font-medium text-text-dark">
                          {parseFloat(item.price).toFixed(2)} CAD × {item.quantity} = {(parseFloat(item.price) * item.quantity).toFixed(2)} CAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{parseFloat(order.total).toFixed(2)} CAD</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-medium" />
                  <span className="text-text-dark">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-medium" />
                  <span className="text-text-dark">{order.customerEmail}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-text-medium" />
                    <span className="text-text-dark">{order.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-text-dark space-y-1">
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Actions */}
            {nextStatusOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nextStatusOptions.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleStatusChange(option.value)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <OptionIcon className="mr-2 h-4 w-4" />
                        {option.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}