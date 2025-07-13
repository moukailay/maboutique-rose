import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  MessageCircle, 
  Star, 
  Mail, 
  Clock,
  CheckCircle,
  Reply,
  Eye
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  product?: {
    name: string;
    id: number;
  };
}

interface ChatMessage {
  id: number;
  message: string;
  userAgent: string;
  response?: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'contacts' | 'reviews' | 'chat'>('contacts');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/contacts');
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/reviews');
      return response.json();
    }
  });

  // Fetch chat messages
  const { data: chatMessages = [], isLoading: chatLoading } = useQuery({
    queryKey: ['/api/chat/messages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/chat/messages');
      return response.json();
    }
  });

  // Mark contact as read
  const markContactReadMutation = useMutation({
    mutationFn: async (contactId: number) => {
      const response = await apiRequest('PUT', `/api/admin/contacts/${contactId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      toast({
        title: "Message marqué comme lu",
        description: "Le statut du message a été mis à jour.",
      });
    }
  });

  // Approve/reject review
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }: { reviewId: number; isApproved: boolean }) => {
      const response = await apiRequest('PUT', `/api/admin/reviews/${reviewId}`, { isApproved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Avis mis à jour",
        description: "Le statut de l'avis a été modifié.",
      });
    }
  });

  // Mark chat message as read
  const markChatReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest('PUT', `/api/chat/messages/${messageId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    }
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (review.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredChatMessages = chatMessages.filter(message => {
    const matchesSearch = message.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const isLoading = contactsLoading || reviewsLoading || chatLoading;

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Messages et avis</h1>
          <p className="text-text-medium">
            Gérer les messages de contact, avis clients et messages de chat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter(c => !c.isRead).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avis en attente</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.filter(r => !r.isApproved).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages chat</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatMessages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('contacts')}
            className={activeTab === 'contacts' ? 'bg-rose-primary hover:bg-rose-light' : ''}
          >
            <Mail className="h-4 w-4 mr-2" />
            Messages de contact ({contacts.length})
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reviews')}
            className={activeTab === 'reviews' ? 'bg-rose-primary hover:bg-rose-light' : ''}
          >
            <Star className="h-4 w-4 mr-2" />
            Avis clients ({reviews.length})
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chat')}
            className={activeTab === 'chat' ? 'bg-rose-primary hover:bg-rose-light' : ''}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages chat ({chatMessages.length})
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'contacts' && (
          <Card>
            <CardHeader>
              <CardTitle>Messages de contact</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-medium">Aucun message trouvé</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statut</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Sujet</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <Badge variant={contact.isRead ? 'outline' : 'default'}>
                            {contact.isRead ? 'Lu' : 'Non lu'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-text-dark">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-text-medium">{contact.email}</div>
                            {contact.phone && (
                              <div className="text-sm text-text-medium">{contact.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-text-dark">{contact.subject}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark max-w-xs truncate">
                            {contact.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markContactReadMutation.mutate(contact.id)}
                              disabled={contact.isRead}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Reply className="h-4 w-4" />
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
        )}

        {activeTab === 'reviews' && (
          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
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
                      <TableHead>Statut</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <Badge variant={review.isApproved ? 'default' : 'outline'}>
                            {review.isApproved ? 'Approuvé' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-text-dark">
                            {review.product?.name || 'Produit supprimé'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {getStars(review.rating)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark max-w-xs truncate">
                            {review.comment}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Anonyme'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateReviewMutation.mutate({ 
                                reviewId: review.id, 
                                isApproved: !review.isApproved 
                              })}
                            >
                              {review.isApproved ? 'Rejeter' : 'Approuver'}
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
        )}

        {activeTab === 'chat' && (
          <Card>
            <CardHeader>
              <CardTitle>Messages du chat</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredChatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-medium">Aucun message de chat trouvé</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statut</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Navigateur</TableHead>
                      <TableHead>Réponse</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChatMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <Badge variant={message.isRead ? 'outline' : 'default'}>
                            {message.isRead ? 'Lu' : 'Non lu'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark max-w-xs truncate">
                            {message.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark text-sm">
                            {message.userAgent.includes('Chrome') ? 'Chrome' : 
                             message.userAgent.includes('Firefox') ? 'Firefox' : 
                             message.userAgent.includes('Safari') ? 'Safari' : 'Autre'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark max-w-xs truncate">
                            {message.response || 'Pas de réponse'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-text-dark">
                            {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markChatReadMutation.mutate(message.id)}
                            disabled={message.isRead}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}