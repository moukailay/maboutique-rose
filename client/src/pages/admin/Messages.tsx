import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Star, 
  Eye,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Send,
  Reply
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface Contact {
  id: number;
  name: string;
  email: string;
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
  productId: number;
  userId: number;
  product?: {
    name: string;
  };
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminMessages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contacts = [], isLoading: loadingContacts } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/contacts');
      return response.json();
    }
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: loadingReviews } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/reviews');
      return response.json();
    }
  });

  // Fetch chat messages
  const { data: chatMessages = [], isLoading: loadingChatMessages, error: chatError } = useQuery({
    queryKey: ['/api/chat/messages'],
    queryFn: async () => {
      // Force request to Express server by using absolute URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/chat/messages`;
      
      const authToken = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      return data;
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
        description: "Le message a été marqué comme lu.",
      });
    }
  });

  // Update review approval
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, isApproved }: { reviewId: number; isApproved: boolean }) => {
      const response = await apiRequest('PUT', `/api/admin/reviews/${reviewId}`, { isApproved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Avis mis à jour",
        description: "Le statut de l'avis a été mis à jour.",
      });
    }
  });

  // Respond to chat message
  const respondToChatMutation = useMutation({
    mutationFn: async ({ messageId, response }: { messageId: number; response: string }) => {
      // Use same approach as chat messages loading
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/chat/messages/${messageId}/response`;
      
      const authToken = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      const apiResponse = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ response }),
      });
      
      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }
      
      return apiResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      });
      setResponseText('');
      setSelectedChatMessage(null);
    }
  });

  const [responseText, setResponseText] = useState('');
  const [selectedChatMessage, setSelectedChatMessage] = useState<any>(null);

  // Mark chat message as read
  const markChatMessageReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/chat/messages/${messageId}/read`;
      
      const authToken = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      toast({
        title: "Message marqué comme lu",
        description: "Le message a été marqué comme lu.",
      });
    }
  });

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (review.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const unreadContacts = contacts.filter(contact => !contact.isRead).length;
  const pendingReviews = reviews.filter(review => !review.isApproved).length;
  const unreadChatMessages = chatMessages.filter(message => !message.isRead).length;
  const unansweredChatMessages = chatMessages.filter(message => !message.adminResponse).length;

  const filteredChatMessages = chatMessages.filter(message => {
    if (!searchQuery.trim()) return true; // Show all if no search query
    return message.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (message.adminResponse && message.adminResponse.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Messages et Avis</h1>
          <p className="text-text-medium">
            Gérer les messages des clients et les avis produits
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
              <div className="text-2xl font-bold text-text-dark">{unreadContacts}</div>
              <p className="text-xs text-text-medium">
                Sur {contacts.length} messages totaux
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat non répondu</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">{unansweredChatMessages}</div>
              <p className="text-xs text-text-medium">
                Sur {chatMessages.length} messages chat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avis en attente</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">{pendingReviews}</div>
              <p className="text-xs text-text-medium">
                Sur {reviews.length} avis totaux
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions requises</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark">{unreadContacts + unansweredChatMessages + pendingReviews}</div>
              <p className="text-xs text-text-medium">
                Total à traiter
              </p>
            </CardContent>
          </Card>
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
                placeholder="Rechercher dans les messages et avis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Messages clients
              {unreadContacts > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadContacts}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages chat
              {unansweredChatMessages > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unansweredChatMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avis produits
              {pendingReviews > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingReviews}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Messages clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingContacts ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-medium">Aucun message trouvé</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statut</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            {contact.isRead ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Lu
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Non lu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-text-dark">{contact.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-dark">{contact.email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-dark max-w-xs truncate">
                              {contact.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-medium">
                              {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!contact.isRead && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markContactReadMutation.mutate(contact.id)}
                                  disabled={markContactReadMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Marquer lu
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Répondre
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
          </TabsContent>

          {/* Chat Messages Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages chat en direct
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingChatMessages ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-medium">Aucun message de chat trouvé</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statut</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Réponse admin</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            {message.adminResponse ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Répondu
                              </Badge>
                            ) : message.isRead ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                Lu
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Non lu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate font-medium text-text-dark">
                              {message.message}
                            </div>
                            {message.userAgent && (
                              <div className="text-xs text-text-medium mt-1">
                                {message.userAgent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-text-medium">
                              <Calendar className="h-3 w-3" />
                              {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {message.adminResponse ? (
                              <div className="max-w-xs">
                                <div className="text-sm text-text-dark truncate">
                                  {message.adminResponse}
                                </div>
                                {message.respondedAt && (
                                  <div className="text-xs text-text-medium mt-1">
                                    Répondu le {new Date(message.respondedAt).toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-text-medium italic">
                                Pas de réponse
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {!message.isRead && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markChatMessageReadMutation.mutate(message.id)}
                                  disabled={markChatMessageReadMutation.isPending}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant={message.adminResponse ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => {
                                      setSelectedChatMessage(message);
                                      setResponseText(message.adminResponse || '');
                                    }}
                                  >
                                    <Reply className="h-3 w-3 mr-1" />
                                    {message.adminResponse ? 'Modifier' : 'Répondre'}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {message.adminResponse ? 'Modifier la réponse' : 'Répondre au message'}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <div className="font-medium text-sm text-text-medium mb-1">Message du client :</div>
                                      <div className="text-text-dark">{message.message}</div>
                                      <div className="text-xs text-text-medium mt-2">
                                        Reçu le {new Date(message.createdAt).toLocaleDateString('fr-FR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-text-dark mb-2">
                                        Votre réponse :
                                      </label>
                                      <Textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Tapez votre réponse ici..."
                                        rows={4}
                                        className="w-full"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedChatMessage(null);
                                          setResponseText('');
                                        }}
                                      >
                                        Annuler
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          if (responseText.trim() && selectedChatMessage) {
                                            respondToChatMutation.mutate({
                                              messageId: selectedChatMessage.id,
                                              response: responseText.trim()
                                            });
                                          }
                                        }}
                                        disabled={!responseText.trim() || respondToChatMutation.isPending}
                                      >
                                        <Send className="h-4 w-4 mr-2" />
                                        {respondToChatMutation.isPending ? 'Envoi...' : 'Envoyer'}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Avis produits
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-medium">Aucun avis trouvé</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statut</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Commentaire</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            {review.isApproved ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Approuvé
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                En attente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-text-dark">
                              {review.product?.name || 'Produit supprimé'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-dark">
                              {review.user?.firstName} {review.user?.lastName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-dark max-w-xs truncate">
                              {review.comment}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-text-medium">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!review.isApproved && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => updateReviewMutation.mutate({
                                    reviewId: review.id,
                                    isApproved: true
                                  })}
                                  disabled={updateReviewMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                              )}
                              {review.isApproved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReviewMutation.mutate({
                                    reviewId: review.id,
                                    isApproved: false
                                  })}
                                  disabled={updateReviewMutation.isPending}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Désapprouver
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}