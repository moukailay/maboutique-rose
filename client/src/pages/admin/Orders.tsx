import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Eye, 
  Edit, 
  Printer, 
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
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
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
    name: string;
    image: string;
  };
}

export default function AdminOrders() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders from API
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleViewOrder = (orderId: number) => {
    setLocation(`/admin/orders/${orderId}`);
  };

  const handlePrintInvoice = (orderId: number) => {
    toast({
      title: "Fonction à venir",
      description: "L'impression de facture sera bientôt disponible.",
    });
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  const statusCounts = getStatusCounts();

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

  if (error) {
    console.error('Error loading orders:', error);
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-text-medium">Erreur lors du chargement des commandes</p>
            <p className="text-sm text-red-500 mt-2">Détails: {error.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Réessayer
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Gestion des Commandes</h1>
          <p className="text-text-medium">
            {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
            {searchQuery && ` trouvée${filteredOrders.length !== 1 ? 's' : ''} pour "${searchQuery}"`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-text-dark">{statusCounts.all}</div>
              <div className="text-sm text-text-medium">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-text-medium">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.paid}</div>
              <div className="text-sm text-text-medium">Payées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{statusCounts.shipped}</div>
              <div className="text-sm text-text-medium">Expédiées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{statusCounts.delivered}</div>
              <div className="text-sm text-text-medium">Livrées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</div>
              <div className="text-sm text-text-medium">Annulées</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par numéro, nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Toutes' },
                  { key: 'pending', label: 'En attente' },
                  { key: 'paid', label: 'Payées' },
                  { key: 'shipped', label: 'Expédiées' },
                  { key: 'delivered', label: 'Livrées' },
                  { key: 'cancelled', label: 'Annulées' }
                ].map(status => (
                  <Button
                    key={status.key}
                    variant={statusFilter === status.key ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status.key)}
                    className={statusFilter === status.key ? 'bg-rose-primary hover:bg-rose-light' : ''}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-medium">Aucune commande trouvée</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="font-medium text-text-dark">#{order.id}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-text-dark">{order.customerName}</div>
                            <div className="text-sm text-text-medium">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">-</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-text-dark">{parseFloat(order.total).toFixed(2)} CAD</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintInvoice(order.id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimer facture
                              </DropdownMenuItem>
                              {order.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'paid')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marquer comme payée
                                </DropdownMenuItem>
                              )}
                              {order.status === 'paid' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Marquer comme expédiée
                                </DropdownMenuItem>
                              )}
                              {order.status === 'shipped' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                                  <Package className="mr-2 h-4 w-4" />
                                  Marquer comme livrée
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}