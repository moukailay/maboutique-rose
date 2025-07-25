import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  List,
  FolderOpen,
  Menu,
  X,
  Star,
  Image
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Récupérer le nombre de messages non lus
  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ['unread-chat-messages'],
    queryFn: async () => {
      const response = await fetch('/api/chat/messages');
      const messages = await response.json();
      return messages.filter((m: any) => !m.isRead).length;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken'); // Nettoyer aussi l'ancien token
    setLocation('/admin/login');
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/admin/dashboard',
      active: location === '/admin/dashboard'
    },
    { 
      icon: Package, 
      label: 'Produits', 
      href: '/admin/products',
      active: location.startsWith('/admin/products'),
      subItems: [
        { icon: List, label: 'Tous les produits', href: '/admin/products' },
        { icon: Plus, label: 'Ajouter un produit', href: '/admin/products/new' }
      ]
    },
    { 
      icon: FolderOpen, 
      label: 'Catégories', 
      href: '/admin/categories',
      active: location === '/admin/categories'
    },
    { 
      icon: ShoppingCart, 
      label: 'Commandes', 
      href: '/admin/orders',
      active: location.startsWith('/admin/orders'),
      subItems: [
        { icon: List, label: 'Gestion des commandes', href: '/admin/orders' },
        { icon: FolderOpen, label: 'Toutes les commandes', href: '/admin/orders/all' }
      ]
    },
    { 
      icon: Users, 
      label: 'Clients', 
      href: '/admin/customers',
      active: location === '/admin/customers'
    },
    { 
      icon: MessageSquare, 
      label: 'Messages & Avis', 
      href: '/admin/messages',
      active: location === '/admin/messages',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    { 
      icon: Star, 
      label: 'Témoignages', 
      href: '/admin/testimonials',
      active: location === '/admin/testimonials'
    },
    { 
      icon: Image, 
      label: 'Carrousel', 
      href: '/admin/hero-slides',
      active: location === '/admin/hero-slides'
    },
    { 
      icon: BarChart3, 
      label: 'Statistiques', 
      href: '/admin/stats',
      active: location === '/admin/stats'
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      href: '/admin/settings',
      active: location === '/admin/settings'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-rose-primary">ROSE-D'ÉDEN</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {menuItems.map((item) => (
              <div key={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    item.active 
                      ? 'bg-rose-primary hover:bg-rose-light text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setLocation(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
                
                {item.subItems && item.active && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-600 hover:bg-gray-100"
                        onClick={() => {
                          setLocation(subItem.href);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <subItem.icon className="mr-2 h-3 w-3" />
                        <span className="truncate">{subItem.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-primary text-xs">
                  3
                </Badge>
              </Button>

              {/* Admin Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-rose-primary text-white">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">Administrateur</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@rose-d-eden.fr
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/admin/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}