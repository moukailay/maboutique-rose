import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch customers from database
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/customers'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/customers');
      return response.json();
    }
  });

  // Fetch orders to calculate customer stats
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    }
  });

  // Calculate customer statistics
  const customersWithStats = users.map(user => {
    const customerOrders = orders.filter(order => order.customerEmail === user.email);
    return {
      ...user,
      orderCount: customerOrders.length,
      totalSpent: customerOrders.reduce((sum, order) => sum + parseFloat(order.total), 0),
      lastOrderDate: customerOrders.length > 0 
        ? Math.max(...customerOrders.map(o => new Date(o.createdAt).getTime()))
        : null
    };
  });

  const filteredCustomers = customersWithStats.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-text-medium">Erreur lors du chargement des clients</p>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Gestion des clients</h1>
            <p className="text-text-medium">
              Voir et gérer les comptes clients
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCustomers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux cette semaine</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredCustomers.filter(c => {
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return new Date(c.createdAt) > weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredCustomers.filter(c => c.orderCount > 0).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
              <div className="text-rose-primary">CAD</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-medium">Aucun client trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Dernière commande</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium text-text-dark">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-text-dark">{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.role === 'admin' ? 'default' : 'outline'}>
                          {customer.role === 'admin' ? 'Admin' : 'Client'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-text-dark">{customer.orderCount || 0}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-text-dark">
                          {(customer.totalSpent || 0).toFixed(2)} CAD
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-text-dark">
                          {customer.lastOrderDate 
                            ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')
                            : 'Aucune'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-text-dark">
                          {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Envoyer un email"
                            onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}