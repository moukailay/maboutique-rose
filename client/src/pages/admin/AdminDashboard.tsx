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
    // Attendre un petit délai pour que le token soit bien stocké
    const checkToken = () => {
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
      
      const finalToken = token || adminToken;
      console.log('Dashboard - finalToken:', finalToken);
      
      return finalToken;
    };
    
    // Vérifier le token avec un petit délai
    const finalToken = checkToken();
    
    // Si pas de token, attendre 200ms et réessayer une fois
    if (!finalToken) {
      setTimeout(() => {
        const retryToken = checkToken();
        if (!retryToken) {
          console.log('Pas de token après retry, redirection vers login');
          setLocation('/admin/login');
          return;
        }
        verifyToken(retryToken);
      }, 200);
      return;
    }
    
    verifyToken(finalToken);
  }, []);

  const verifyToken = (finalToken: string) => {
    // Vérifier la validité du token
    console.log('Vérification du token...');
    
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${finalToken}`
      }
    })
    .then(response => {
      console.log('Réponse de vérification du token:', response.status);
      if (!response.ok) {
        console.log('Token invalide, redirection vers login');
        localStorage.removeItem('authToken');
        setLocation('/admin/login');
      } else {
        console.log('Token valide, dashboard peut s\'afficher');
        console.log('Dashboard prêt à s\'afficher avec le token valide');
      }
    })
    .catch(error => {
      console.log('Erreur de vérification du token:', error);
      // Ne pas supprimer le token en cas d'erreur réseau
      console.log('Erreur réseau, on garde le token');
    });
  };

  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await apiRequest('/api/orders');
      return response.json();
    }
  });

  // Fetch customers
  const { data: customers = [] } = useQuery({
    queryKey: ['/api/admin/customers'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/customers');
      return response.json();
    }
  });

  // Fetch contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/contacts');
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/reviews');
      return response.json();
    }
  });

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await apiRequest('/api/products');
      return response.json();
    }
  });

  // Calculate statistics
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
  const recentOrders = orders.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return orderDate > weekAgo;
  });

  const unreadContacts = contacts.filter((contact: any) => !contact.isRead).length;
  const pendingReviews = reviews.filter((review: any) => !review.isApproved).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-text-dark">Tableau de bord</h1>
          <p className="text-text-medium text-sm lg:text-base">
            Bienvenue dans votre panneau d'administration Rose-D'Éden
          </p>
        </div>

        {/* Main Actions - Les 3 sections principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Gestion des commandes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/orders')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">Gestion des commandes</CardTitle>
              <ShoppingCart className="h-6 w-6 lg:h-8 lg:w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs lg:text-sm text-text-medium mb-3 lg:mb-4">
                Voir et gérer toutes les commandes
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl lg:text-2xl font-bold text-text-dark">{orders.length}</div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/orders');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light text-xs lg:text-sm"
                >
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des clients */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/customers')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">Gestion des clients</CardTitle>
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs lg:text-sm text-text-medium mb-3 lg:mb-4">
                Voir et gérer les comptes clients
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl lg:text-2xl font-bold text-text-dark">{customers.length}</div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/customers');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light text-xs lg:text-sm"
                >
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages et avis */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/admin/messages')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">Messages et avis</CardTitle>
              <MessageSquare className="h-6 w-6 lg:h-8 lg:w-8 text-rose-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xs lg:text-sm text-text-medium mb-3 lg:mb-4">
                Gérer les messages et avis clients
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl lg:text-2xl font-bold text-text-dark">
                  {unreadContacts + pendingReviews}
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation('/admin/messages');
                  }}
                  size="sm"
                  className="bg-rose-primary hover:bg-rose-light text-xs lg:text-sm"
                >
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Commandes totales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground hidden lg:block">
                +{recentOrders.length} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Chiffre d'affaires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{totalRevenue.toFixed(2)} CAD</div>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Total des ventes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Produits en catalogue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Clients inscrits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
            <CardTitle className="text-base lg:text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Button 
                onClick={() => setLocation('/admin/products/add')}
                className="bg-rose-primary hover:bg-rose-light text-sm lg:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
              <Button 
                onClick={() => setLocation('/admin/orders')}
                variant="outline"
                className="text-sm lg:text-base"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir toutes les commandes
              </Button>
              <Button 
                onClick={() => setLocation('/admin/messages')}
                variant="outline"
                className="text-sm lg:text-base"
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