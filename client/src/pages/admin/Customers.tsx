import { useState } from 'react';
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
  Ban, 
  CheckCircle, 
  MoreHorizontal,
  Users,
  Calendar,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Customer {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  lastOrderDate?: string;
}

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const customers: Customer[] = [
    { id: 1, name: 'Marie Dubois', email: 'marie.dubois@email.com', registrationDate: '2023-06-15', ordersCount: 8, totalSpent: 456.50, status: 'active', lastOrderDate: '2024-01-15' },
    { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', registrationDate: '2023-08-22', ordersCount: 12, totalSpent: 789.90, status: 'active', lastOrderDate: '2024-01-14' },
    { id: 3, name: 'Sophie Chen', email: 'sophie.chen@email.com', registrationDate: '2023-09-10', ordersCount: 15, totalSpent: 1245.00, status: 'active', lastOrderDate: '2024-01-13' },
    { id: 4, name: 'Pierre Blanc', email: 'pierre.blanc@email.com', registrationDate: '2023-11-05', ordersCount: 3, totalSpent: 167.30, status: 'blocked', lastOrderDate: '2023-12-20' },
    { id: 5, name: 'Claire Lopez', email: 'claire.lopez@email.com', registrationDate: '2023-12-01', ordersCount: 6, totalSpent: 356.75, status: 'active', lastOrderDate: '2024-01-11' },
    { id: 6, name: 'Thomas Bernard', email: 'thomas.bernard@email.com', registrationDate: '2024-01-03', ordersCount: 2, totalSpent: 89.50, status: 'active', lastOrderDate: '2024-01-10' },
    { id: 7, name: 'Emma Rousseau', email: 'emma.rousseau@email.com', registrationDate: '2024-01-08', ordersCount: 1, totalSpent: 45.00, status: 'active', lastOrderDate: '2024-01-08' }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (customerId: number, currentStatus: string) => {
    // In real app, this would call API to toggle customer status
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    console.log('Toggle customer status:', customerId, newStatus);
  };

  const handleViewProfile = (customerId: number) => {
    // In real app, this would navigate to customer profile page
    console.log('View customer profile:', customerId);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Actif' : 'Bloqué';
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return { tier: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 500) return { tier: 'Premium', color: 'bg-blue-100 text-blue-800' };
    return { tier: 'Standard', color: 'bg-gray-100 text-gray-800' };
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    blocked: customers.filter(c => c.status === 'blocked').length,
    newThisMonth: customers.filter(c => new Date(c.registrationDate) >= new Date('2024-01-01')).length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Gestion des Clients</h1>
          <p className="text-text-medium">
            {filteredCustomers.length} client{filteredCustomers.length !== 1 ? 's' : ''}
            {searchQuery && ` trouvé${filteredCustomers.length !== 1 ? 's' : ''} pour "${searchQuery}"`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-rose-primary" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.total}</div>
                  <div className="text-sm text-text-medium">Total clients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.active}</div>
                  <div className="text-sm text-text-medium">Clients actifs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ban className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.blocked}</div>
                  <div className="text-sm text-text-medium">Clients bloqués</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.newThisMonth}</div>
                  <div className="text-sm text-text-medium">Nouveaux ce mois</div>
                </div>
              </div>
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
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Tous
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Actifs
                </Button>
                <Button
                  variant={statusFilter === 'blocked' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('blocked')}
                  className={statusFilter === 'blocked' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Bloqués
                </Button>
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
                    <TableHead>Inscription</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const tier = getCustomerTier(customer.totalSpent);
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-text-dark">{customer.name}</div>
                            <div className="text-sm text-text-medium">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(customer.registrationDate).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ShoppingCart className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-text-dark">{customer.ordersCount}</span>
                          </div>
                          {customer.lastOrderDate && (
                            <div className="text-xs text-text-medium">
                              Dernière: {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-medium text-text-dark">{customer.totalSpent.toFixed(2)} CAD</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={tier.color}>
                            {tier.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            {getStatusText(customer.status)}
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
                              <DropdownMenuItem onClick={() => handleViewProfile(customer.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, customer.status)}>
                                {customer.status === 'active' ? (
                                  <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Bloquer
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Débloquer
                                  </>
                                )}
                              </DropdownMenuItem>
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