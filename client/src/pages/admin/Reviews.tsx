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
  Star, 
  Check, 
  X, 
  Trash2, 
  MoreHorizontal,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Review {
  id: number;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Mock data - in real app, this would come from API
  const reviews: Review[] = [
    { id: 1, customerName: 'Marie Dubois', productName: 'Miel Bio Artisanal', rating: 5, comment: 'Excellent produit, très savoureux et naturel. Je recommande vivement !', date: '2024-01-15', status: 'pending' },
    { id: 2, customerName: 'Jean Martin', productName: 'Huile Essentielle Lavande', rating: 4, comment: 'Très bonne qualité, senteur agréable. Parfait pour la relaxation.', date: '2024-01-14', status: 'approved' },
    { id: 3, customerName: 'Sophie Chen', productName: 'Tisane Relaxante', rating: 5, comment: 'Goût délicieux et très efficace pour dormir. Je rachèterai !', date: '2024-01-13', status: 'approved' },
    { id: 4, customerName: 'Pierre Blanc', productName: 'Savon Naturel Rose', rating: 2, comment: 'Pas satisfait de ce produit, trop dur pour ma peau sensible.', date: '2024-01-12', status: 'rejected' },
    { id: 5, customerName: 'Claire Lopez', productName: 'Crème Visage Bio', rating: 4, comment: 'Bonne crème, hydrate bien. Texture agréable.', date: '2024-01-11', status: 'pending' },
    { id: 6, customerName: 'Thomas Bernard', productName: 'Miel Bio Artisanal', rating: 5, comment: 'Le meilleur miel que j\'ai jamais goûté ! Livraison rapide.', date: '2024-01-10', status: 'approved' },
    { id: 7, customerName: 'Emma Rousseau', productName: 'Tisane Relaxante', rating: 3, comment: 'Correct mais sans plus. Le goût est un peu fade à mon goût.', date: '2024-01-09', status: 'pending' }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleApprove = (reviewId: number) => {
    // In real app, this would call API to approve review

  };

  const handleReject = (reviewId: number) => {
    // In real app, this would call API to reject review

  };

  const handleDelete = (reviewId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      // In real app, this would call API to delete review

    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Gestion des Avis Clients</h1>
          <p className="text-text-medium">
            {filteredReviews.length} avis
            {searchQuery && ` trouvé${filteredReviews.length !== 1 ? 's' : ''} pour "${searchQuery}"`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-rose-primary" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.total}</div>
                  <div className="text-sm text-text-medium">Total avis</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.pending}</div>
                  <div className="text-sm text-text-medium">En attente</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.approved}</div>
                  <div className="text-sm text-text-medium">Approuvés</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.rejected}</div>
                  <div className="text-sm text-text-medium">Rejetés</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-dark">{stats.averageRating.toFixed(1)}</div>
                  <div className="text-sm text-text-medium">Note moyenne</div>
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
                    placeholder="Rechercher par client, produit ou commentaire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Status Filter */}
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Tous
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  className={statusFilter === 'pending' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  En attente
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                  className={statusFilter === 'approved' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Approuvés
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                  className={statusFilter === 'rejected' ? 'bg-rose-primary hover:bg-rose-light' : ''}
                >
                  Rejetés
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des avis</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-medium">Aucun avis trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-text-dark">{review.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-text-dark">{review.productName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-text-medium">({review.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-text-dark line-clamp-2">{review.comment}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-text-dark">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(review.status)}>
                          {getStatusText(review.status)}
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
                            {review.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(review.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(review.id)}>
                                  <X className="mr-2 h-4 w-4" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(review.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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