import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { MessageCircle, Eye, EyeOff, Clock, User, Monitor, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/admin/AdminLayout';

interface ChatMessage {
  id: number;
  message: string;
  userAgent: string | null;
  url: string | null;
  ipAddress: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function ChatMessages() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages'],
    queryFn: async () => {
      const response = await fetch('/api/chat/messages');
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest(`/api/chat/messages/${messageId}/read`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    },
  });

  const handleMarkAsRead = (messageId: number) => {
    markAsReadMutation.mutate(messageId);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement des messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-rose-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Messages du Chat
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Gérez les messages des clients du chat en direct
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-sm">
              {unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? 's' : ''}` : 'Tous lus'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Messages récents ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        message.isRead 
                          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                          : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700'
                      } ${
                        selectedMessage?.id === message.id 
                          ? 'ring-2 ring-rose-primary' 
                          : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Visiteur #{message.id}
                            </span>
                            {!message.isRead && (
                              <Badge variant="destructive" className="text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                            {message.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {message.isRead ? (
                            <Eye className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-rose-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Aucun message reçu pour le moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du message sélectionné */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedMessage ? `Message #${selectedMessage.id}` : 'Sélectionner un message'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  {/* Statut et actions */}
                  <div className="flex items-center justify-between">
                    <Badge variant={selectedMessage.isRead ? "secondary" : "destructive"}>
                      {selectedMessage.isRead ? 'Lu' : 'Non lu'}
                    </Badge>
                    {!selectedMessage.isRead && (
                      <Button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        disabled={markAsReadMutation.isPending}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Marquer comme lu
                      </Button>
                    )}
                  </div>

                  {/* Contenu du message */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Message :</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Informations techniques */}
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Informations techniques :
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">Date :</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(selectedMessage.createdAt)}
                        </span>
                      </div>
                      
                      {selectedMessage.ipAddress && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">IP :</span>
                          <span className="text-gray-900 dark:text-white font-mono text-xs">
                            {selectedMessage.ipAddress}
                          </span>
                        </div>
                      )}
                      
                      {selectedMessage.url && (
                        <div className="flex items-start space-x-2">
                          <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-400">Page :</span>
                          <span className="text-gray-900 dark:text-white font-mono text-xs break-all">
                            {selectedMessage.url}
                          </span>
                        </div>
                      )}
                      
                      {selectedMessage.userAgent && (
                        <div className="flex items-start space-x-2">
                          <Monitor className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-400">Navigateur :</span>
                          <span className="text-gray-900 dark:text-white font-mono text-xs break-all">
                            {selectedMessage.userAgent}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Sélectionnez un message pour voir les détails
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}