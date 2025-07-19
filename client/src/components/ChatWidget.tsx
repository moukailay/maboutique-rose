import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface ChatMessage {
  id: number;
  message: string;
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
  isRead: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'admin';
  timestamp: Date;
  isFromDatabase?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [messageCounter, setMessageCounter] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasNewAdminResponse, setHasNewAdminResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Récupérer les messages de chat depuis la base de données
  const fetchChatMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const dbMessages = await response.json();
        setChatMessages(dbMessages);
        
        // Convertir les messages de la base de données en format Message
        const convertedMessages: Message[] = [];
        
        dbMessages.forEach((chatMsg: ChatMessage) => {
          // Ajouter le message utilisateur
          convertedMessages.push({
            id: `db-user-${chatMsg.id}`,
            text: chatMsg.message,
            sender: 'user',
            timestamp: new Date(chatMsg.createdAt),
            isFromDatabase: true
          });
          
          // Ajouter la réponse admin si elle existe
          if (chatMsg.adminResponse) {
            convertedMessages.push({
              id: `db-admin-${chatMsg.id}`,
              text: chatMsg.adminResponse,
              sender: 'admin',
              timestamp: new Date(chatMsg.respondedAt || chatMsg.createdAt),
              isFromDatabase: true
            });
          }
        });
        
        // Remplacer les messages existants par ceux de la base de données
        setMessages(convertedMessages);
        
        // Vérifier s'il y a de nouvelles réponses admin
        const hasNewResponses = dbMessages.some((msg: ChatMessage) => 
          msg.adminResponse && !msg.isRead
        );
        setHasNewAdminResponse(hasNewResponses);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    }
  };

  // Récupérer les messages au chargement du composant et périodiquement
  useEffect(() => {
    fetchChatMessages();
    
    // Vérifier les nouvelles réponses toutes les 10 secondes
    const interval = setInterval(fetchChatMessages, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Gestionnaire de clic extérieur pour fermer le chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Messages d'accueil automatiques avec séquence
  useEffect(() => {
    // Seulement afficher les messages d'accueil s'il n'y a pas de messages de la DB
    if (messages.length === 0 && chatMessages.length === 0) {
      const welcomeMessage1: Message = {
        id: `welcome-${messageCounter}`,
        text: t('chat.welcome'),
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage1]);
      setMessageCounter(prev => prev + 1);
      
      // Ajouter le second message après un délai
      setTimeout(() => {
        const welcomeMessage2: Message = {
          id: `welcome-${messageCounter + 1}`,
          text: t('chat.welcome_options'),
          sender: 'support',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, welcomeMessage2]);
        setMessageCounter(prev => prev + 1);
      }, 1500);
    }
  }, [t, messageCounter, messages.length, chatMessages.length]);

  // Marquer les nouvelles réponses comme vues quand on ouvre le chat
  useEffect(() => {
    if (isOpen && hasNewAdminResponse) {
      setHasNewAdminResponse(false);
    }
  }, [isOpen, hasNewAdminResponse]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    const currentCounter = messageCounter;
    
    const userMessage: Message = {
      id: `user-${currentCounter}`,
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, userMessage]);
    setMessageCounter(prev => prev + 1);
    setNewMessage('');
    setIsTyping(true);

    // Sauvegarder le message dans la base de données
    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        }),
      });
      
      // Récupérer les messages mis à jour après l'envoi
      setTimeout(() => {
        fetchChatMessages();
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
    }

    // Réponses automatiques intelligentes en français
    setTimeout(() => {
      let responseText = t('chat.auto_response');
      
      // Réponses contextuelles selon le message
      const userText = messageToSend.toLowerCase();
      if (userText.includes('prix') || userText.includes('coût') || userText.includes('tarif')) {
        responseText = t('chat.response_pricing');
      } else if (userText.includes('livraison') || userText.includes('expédition')) {
        responseText = t('chat.response_shipping');
      } else if (userText.includes('produit') || userText.includes('bio') || userText.includes('naturel')) {
        responseText = t('chat.response_products');
      } else if (userText.includes('commande') || userText.includes('commander')) {
        responseText = t('chat.response_order');
      }
      
      const autoResponse: Message = {
        id: `support-${currentCounter + 1}`,
        text: responseText,
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, autoResponse]);
      setMessageCounter(prev => prev + 1);
      setIsTyping(false);
    }, Math.random() * 1500 + 1000); // Délai variable pour plus de réalisme
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant avec indicateur en ligne */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="h-16 w-16 rounded-full bg-rose-primary hover:bg-rose-light shadow-lg transition-all duration-300 hover:scale-110 group"
            size="icon"
          >
            {isOpen ? (
              <X className="h-7 w-7 text-white" />
            ) : (
              <MessageCircle className="h-7 w-7 text-white" />
            )}
            {isOnline && !isOpen && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
            {hasNewAdminResponse && !isOpen && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            )}
          </Button>
          
          {/* Tooltip d'aide */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                {t('chat.help_tooltip')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fenêtre de chat avec design québécois */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="fixed bottom-24 right-6 z-50 w-80 h-[500px] animate-in slide-in-from-bottom-5 fade-in-0 duration-300"
        >
          <Card className="h-full flex flex-col shadow-xl border-2 border-rose-primary/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-primary to-rose-dark text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Headphones className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {t('chat.title')}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-xs text-rose-100">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{t('chat.online_status')}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-rose-light/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 bg-white dark:bg-gray-800">
              {/* Messages avec avatars */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                  >
                    {(message.sender === 'support' || message.sender === 'admin') && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'admin' 
                          ? 'bg-blue-600' 
                          : 'bg-rose-primary'
                      }`}>
                        {message.sender === 'admin' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Headphones className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}
                    
                    <div className={`max-w-xs ${message.sender === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm ${
                          message.sender === 'user'
                            ? 'bg-rose-primary text-white rounded-br-md'
                            : message.sender === 'admin'
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-bl-md dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 px-2 flex items-center justify-between">
                        <span>
                          {message.timestamp.toLocaleTimeString('fr-CA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.sender === 'admin' && (
                          <span className="text-blue-600 font-medium text-xs">Admin</span>
                        )}
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start items-start space-x-2">
                    <div className="w-8 h-8 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie améliorée */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 rounded-full"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-rose-primary hover:bg-rose-light rounded-full w-10 h-10"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {t('chat.powered_by')} ROSE-D'ÉDEN
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}