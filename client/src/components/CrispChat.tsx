import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

// Déclaration des types pour Crisp
declare global {
  interface Window {
    $crisp: any;
    CRISP_WEBSITE_ID: string;
  }
}

interface CrispChatProps {
  websiteId: string;
}

export default function CrispChat({ websiteId }: CrispChatProps) {
  const { language } = useTranslation();

  useEffect(() => {
    // Configuration de Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    // Chargement du script Crisp
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    // Configuration des paramètres Crisp
    window.$crisp.push(['set', 'session:data', [
      ['site_name', 'ROSE-D\'ÉDEN'],
      ['site_url', window.location.href]
    ]]);

    // Configuration de la langue
    window.$crisp.push(['set', 'session:segments', [language === 'fr' ? 'français' : 'english']]);
    
    // Message d'accueil personnalisé
    const welcomeMessage = language === 'fr' 
      ? 'Bonjour 👋 Comment pouvons-nous vous aider avec nos produits naturels ?'
      : 'Hello 👋 How can we help you with our natural products?';
      
    window.$crisp.push(['set', 'session:data', [
      ['welcome_message', welcomeMessage]
    ]]);

    // Configuration du thème ROSE-D'ÉDEN
    window.$crisp.push(['set', 'chat:color', '#e11d48']); // Rose primary color
    
    // Cleanup function
    return () => {
      // Nettoyage si nécessaire
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:hide']);
      }
    };
  }, [websiteId, language]);

  // Mise à jour de la langue en temps réel
  useEffect(() => {
    if (window.$crisp) {
      window.$crisp.push(['set', 'session:segments', [language === 'fr' ? 'français' : 'english']]);
      
      const welcomeMessage = language === 'fr' 
        ? 'Bonjour 👋 Comment pouvons-nous vous aider avec nos produits naturels ?'
        : 'Hello 👋 How can we help you with our natural products?';
        
      window.$crisp.push(['set', 'session:data', [
        ['welcome_message', welcomeMessage]
      ]]);
    }
  }, [language]);

  return null; // Ce composant n'a pas de rendu visuel
}