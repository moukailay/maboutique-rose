import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { t, language } = useTranslation();

  // Messages d'accueil automatiques avec séquence
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: 'welcome-1',
        text: t('chat.welcome'),
        sender: 'support',
        timestamp: new Date()
      },
      {
        id: 'welcome-2',
        text: t('chat.welcome_options'),
        sender: 'support',
        timestamp: new Date(Date.now() + 1000)
      }
    ];
    
    setMessages([welcomeMessages[0]]);
    
    // Ajouter le second message après un délai
    setTimeout(() => {
      setMessages(prev => [...prev, welcomeMessages[1]]);
    }, 1500);
  }, [t]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Réponses automatiques intelligentes en français
    setTimeout(() => {
      let responseText = t('chat.auto_response');
      
      // Réponses contextuelles selon le message
      const userText = newMessage.toLowerCase();
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
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, autoResponse]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000); // Délai variable pour plus de réalisme
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
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-rose-primary hover:bg-rose-light shadow-lg transition-all duration-300 hover:scale-110 group"
            size="icon"
          >
            <MessageCircle className="h-7 w-7 text-white" />
            {isOnline && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </Button>
          
          {/* Tooltip d'aide */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
              {t('chat.help_tooltip')}
            </div>
          </div>
        </div>
      </div>

      {/* Fenêtre de chat avec design québécois */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-[500px] animate-in slide-in-from-bottom-5 fade-in-0 duration-300">
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
                    {message.sender === 'support' && (
                      <div className="w-8 h-8 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Headphones className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-xs ${message.sender === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm ${
                          message.sender === 'user'
                            ? 'bg-rose-primary text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 px-2">
                        {message.timestamp.toLocaleTimeString('fr-CA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
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