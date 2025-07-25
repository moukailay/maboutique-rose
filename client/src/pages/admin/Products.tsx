import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Filter,
  Star
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Product } from '@shared/schema';

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const updateFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: number, isFeatured: boolean }) => {
      console.log('Updating featured status:', { id, isFeatured });
      const response = await fetch(`/api/products/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }
      
      const result = await response.json();
      console.log('Featured status update response:', result);
      return result;
    },
    onSuccess: async (data, variables) => {
      console.log('Featured status updated successfully:', data);
      
      // Update the cache directly with optimistic update
      queryClient.setQueryData(['/api/products'], (oldData: Product[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(product => 
          product.id === variables.id 
            ? { ...product, isFeatured: variables.isFeatured }
            : product
        );
      });
      
      // Also refresh the featured products cache
      queryClient.invalidateQueries({ queryKey: ['/api/products/featured'] });
      
      toast({
        title: "Succès",
        description: `Le produit ${variables.isFeatured ? 'est maintenant' : 'n\'est plus'} en vedette`,
      });
    },
    onError: (error, variables) => {
      console.error('Failed to update featured status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut vedette du produit",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.stock > 0) ||
                         (statusFilter === 'inactive' && product.stock === 0);
    return matchesSearch && matchesStatus;
  }) || [];



  const handleDeleteProduct = (productId: number) => {
    // In real app, this would call API to delete product
    console.log('Delete product:', productId);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (stock < 10) return { text: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Gestion des Produits</h1>
            <p className="text-text-medium">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} 
              {searchQuery && ` trouvé${filteredProducts.length !== 1 ? 's' : ''} pour "${searchQuery}"`}
            </p>
          </div>
          <Button 
            onClick={() => setLocation('/admin/products/add')}
            className="bg-rose-primary hover:bg-rose-light"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
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
                    placeholder="Rechercher par nom ou description..."
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
                  En stock
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Rupture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des produits</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-primary mx-auto"></div>
                <p className="text-text-medium mt-2">Chargement des produits...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-medium">Aucun produit trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Vedette</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-text-dark">{product.name}</p>
                              <p className="text-sm text-text-medium line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.categoryId === 1 ? 'Miel & Apiculture' :
                             product.categoryId === 2 ? 'Huiles Essentielles' :
                             product.categoryId === 3 ? 'Tisanes & Infusions' :
                             'Cosmétiques Naturels'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-text-dark">{product.price} CAD</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-text-dark">{product.stock}</p>
                            <Badge className={stockStatus.color}>
                              {stockStatus.text}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {product.stock > 0 ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={product.isFeatured || false}
                              onCheckedChange={(checked) => {
                                console.log('Switch toggled:', { productId: product.id, from: product.isFeatured, to: checked });
                                updateFeaturedMutation.mutate({ id: product.id, isFeatured: checked });
                              }}
                              disabled={updateFeaturedMutation.isPending}
                            />
                            {product.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setLocation(`/admin/products/${product.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Toggle status:', product.id)}>
                                {product.stock > 0 ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
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