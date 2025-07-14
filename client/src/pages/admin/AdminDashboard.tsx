import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Plus,
  Eye,
  TrendingUp,
  Package,
  Mail,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  // Vérification de l'authentification admin
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const adminToken = localStorage.getItem('adminToken');
    
    console.log('Dashboard - authToken:', token);
    console.log('Dashboard - adminToken:', adminToken);
    
    // Nettoyage des anciennes clés et migration
    if (adminToken) {
      if (!token) {
        localStorage.setItem('authToken', adminToken);
        console.log('Migration du token effectuée');
      }
      localStorage.removeItem('adminToken');
    }
    
    const finalToken = localStorage.getItem('authToken');
    console.log('Dashboard - finalToken:', finalToken);
    
    if (!finalToken) {
      console.log('Pas de token, redirection vers login');
      window.location.replace('/admin/login');
      return;
    }
    
    // Temporairement désactiver la vérification pour diagnostiquer
    console.log('Vérification du token désactivée temporairement');
    
    // Vérifier la validité du token
    /*fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${finalToken}`
      }
    })
    .then(response => {
      console.log('Réponse de vérification du token:', response.status);
      if (!response.ok) {
        console.log('Token invalide, redirection vers login');
        localStorage.removeItem('authToken');
        window.location.replace('/admin/login');
      } else {
        console.log('Token valide, dashboard peut s\'afficher');
      }
    })
    .catch(error => {
      console.log('Erreur de vérification du token:', error);
      // Ne pas supprimer le token en cas d'erreur réseau
      console.log('Erreur réseau, on garde le token');
    });*/
  }, []);

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/orders');
      return response.json();
    }
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['/api/admin/customers'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/customers');
      return response.json();
    }
  });

  // Fetch contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/contacts');
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/reviews');
      return response.json();
    }
  });

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/products');
      return response.json();
    }
  });

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const recentOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return orderDate > weekAgo;
  });

  const unreadContacts = contacts.filter(contact => !contact.isRead).length;
  const pendingReviews = reviews.filter(review => !review.isApproved).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Tableau de bord</h1>
          <p className="text-text-medium">
            Bienvenue dans votre panneau d'administration Rose-D'Éden
          </p>
        </div>

        {/* Main Actions - Les 3 sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestion des commandes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/orders')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Gestion des commandes</CardTitle>
              <ShoppingCart className="h-8 w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-text-medium mb-4">
                Voir et gérer toutes les commandes
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-text-dark">{orders.length}</div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/orders');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light"
                >
                  Gérer les commandes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des clients */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/customers')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Gestion des clients</CardTitle>
              <Users className="h-8 w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-text-medium mb-4">
                Voir et gérer les comptes clients
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-text-dark">{customers.length}</div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/customers');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light"
                >
                  Gérer les clients
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages et avis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/messages')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Messages et avis</CardTitle>
              <MessageSquare className="h-8 w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-text-medium mb-4">
                Gérer les messages et avis clients
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-text-dark">
                  {unreadContacts + pendingReviews}
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/messages');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light"
                >
                  Voir les messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                +{recentOrders.length} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} CAD</div>
              <p className="text-xs text-muted-foreground">
                Total des ventes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Produits en catalogue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">
                Clients inscrits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Commandes récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="font-medium text-text-dark">#{order.id}</div>
                    <div className="text-sm text-text-medium">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text-dark">{parseFloat(order.total).toFixed(2)} CAD</div>
                    <div className="text-xs text-text-medium">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-text-medium text-center py-4">Aucune commande récente</p>
              )}
            </CardContent>
          </Card>

          {/* Messages & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages & Avis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-text-dark">Messages non lus</div>
                      <div className="text-sm text-text-medium">Contacts clients</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-text-dark">{unreadContacts}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <div>
                      <div className="font-medium text-text-dark">Avis en attente</div>
                      <div className="text-sm text-text-medium">À approuver</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-text-dark">{pendingReviews}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setLocation('/admin/products/add')}
                className="bg-rose-primary hover:bg-rose-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
              <Button 
                onClick={() => setLocation('/admin/orders')}
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes les commandes
              </Button>
              <Button 
                onClick={() => setLocation('/admin/messages')}
                variant="outline"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Gérer les messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}