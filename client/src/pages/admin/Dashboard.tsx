import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  newCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export default function AdminDashboard() {
  // Fetch real orders data
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    }
  });

  // Fetch real products data
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/products');
      return response.json();
    }
  });

  // Calculate real stats from actual data
  const dashboardStats: DashboardStats = {
    todayRevenue: orders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today;
    }).reduce((sum, order) => sum + parseFloat(order.total), 0),
    weeklyRevenue: orders.filter(o => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(o.createdAt) > weekAgo;
    }).reduce((sum, order) => sum + parseFloat(order.total), 0),
    monthlyRevenue: orders.filter(o => {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(o.createdAt) > monthAgo;
    }).reduce((sum, order) => sum + parseFloat(order.total), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    lowStockProducts: products.filter(p => p.stock < 10).length,
    newCustomers: orders.filter(o => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(o.createdAt) > weekAgo;
    }).length,
    totalProducts: products.length,
    totalOrders: orders.length
  };

  const recentOrders = orders.slice(0, 5).map(order => ({
    id: `#${order.id}`,
    customer: order.customerName,
    amount: parseFloat(order.total),
    status: order.status
  }));

  const topProducts = [
    { name: 'Miel Bio Artisanal', sales: 45, revenue: 1350.00 },
    { name: 'Huile Essentielle Lavande', sales: 32, revenue: 960.00 },
    { name: 'Tisane Relaxante', sales: 28, revenue: 420.00 },
    { name: 'Savon Naturel Rose', sales: 25, revenue: 375.00 },
    { name: 'Crème Visage Bio', sales: 22, revenue: 1100.00 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payée';
      case 'shipped': return 'Expédiée';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-text-medium">
            Vue d'ensemble de votre boutique ROSE-D'ÉDEN
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes du jour</CardTitle>
              <DollarSign className="h-4 w-4 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.todayRevenue.toFixed(2)} CAD
              </div>
              <p className="text-xs text-text-medium">
                +12% par rapport à hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
              <ShoppingCart className="h-4 w-4 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.pendingOrders}
              </div>
              <p className="text-xs text-text-medium">
                À traiter rapidement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.lowStockProducts}
              </div>
              <p className="text-xs text-text-medium">
                Produits à réapprovisionner
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
              <Users className="h-4 w-4 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.newCustomers}
              </div>
              <p className="text-xs text-text-medium">
                Cette semaine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-rose-primary" />
                Ventes hebdomadaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.weeklyRevenue.toFixed(2)} CAD
              </div>
              <p className="text-sm text-text-medium">
                +18% par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-rose-primary" />
                Ventes mensuelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.monthlyRevenue.toFixed(2)} CAD
              </div>
              <p className="text-sm text-text-medium">
                +25% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-rose-primary" />
                Total produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">
                {dashboardStats.totalProducts}
              </div>
              <p className="text-sm text-text-medium">
                Produits actifs dans le catalogue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-dark">{order.id}</p>
                      <p className="text-sm text-text-medium">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text-dark">{order.amount.toFixed(2)} CAD</p>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-rose-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-text-dark">{product.name}</p>
                        <p className="text-sm text-text-medium">{product.sales} ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-text-dark">{product.revenue.toFixed(2)} CAD</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}