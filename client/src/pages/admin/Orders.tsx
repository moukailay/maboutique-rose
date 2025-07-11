import { useState } from 'react';
import { useLocation } from 'wouter';
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
import AdminLayout from '@/components/admin/AdminLayout';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemsCount: number;
}

export default function AdminOrders() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const orders: Order[] = [
    { id: '#2024-001', customerName: 'Marie Dubois', customerEmail: 'marie.dubois@email.com', date: '2024-01-15', status: 'pending', total: 125.50, itemsCount: 3 },
    { id: '#2024-002', customerName: 'Jean Martin', customerEmail: 'jean.martin@email.com', date: '2024-01-14', status: 'paid', total: 89.90, itemsCount: 2 },
    { id: '#2024-003', customerName: 'Sophie Chen', customerEmail: 'sophie.chen@email.com', date: '2024-01-13', status: 'shipped', total: 245.00, itemsCount: 5 },
    { id: '#2024-004', customerName: 'Pierre Blanc', customerEmail: 'pierre.blanc@email.com', date: '2024-01-12', status: 'delivered', total: 67.30, itemsCount: 1 },
    { id: '#2024-005', customerName: 'Claire Lopez', customerEmail: 'claire.lopez@email.com', date: '2024-01-11', status: 'cancelled', total: 156.75, itemsCount: 4 }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In real app, this would call API to update order status
    console.log('Update order status:', orderId, newStatus);
  };

  const handleViewOrder = (orderId: string) => {
    setLocation(`/admin/orders/${orderId}`);
  };

  const handlePrintInvoice = (orderId: string) => {
    // In real app, this would generate and print PDF invoice
    console.log('Print invoice for order:', orderId);
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
                          <div className="font-medium text-text-dark">{order.id}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-text-dark">{order.customerName}</div>
                            <div className="text-sm text-text-medium">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">{order.itemsCount} article{order.itemsCount !== 1 ? 's' : ''}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-text-dark">{order.total.toFixed(2)} CAD</div>
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