import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings, Check } from 'lucide-react';
import { Link } from 'wouter';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours requis
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Délai pour laisser la page se charger
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Charger les préférences sauvegardées
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences cookies:', error);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Activer Google Analytics ou autres services si nécessaire
    if (allAccepted.analytics) {
      // window.gtag && window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  };

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(essentialOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Activer/désactiver les services selon les préférences
    if (preferences.analytics) {
      // window.gtag && window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
  };

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'essential') return; // Les cookies essentiels ne peuvent pas être désactivés
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-50">
        <Card className="border-2 border-rose-200 shadow-xl bg-white dark:bg-gray-800 max-w-4xl mx-auto">
          <CardContent className="p-6">
            {!showSettings ? (
              /* Bannière principale */
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cookie className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nous utilisons des cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Rose-d'Éden utilise des cookies pour améliorer votre expérience de navigation, 
                      analyser l'utilisation du site et vous proposer des contenus personnalisés. 
                      En continuant à naviguer, vous acceptez notre utilisation des cookies.
                    </p>
                    <div className="mt-3">
                      <Link 
                        href="/privacy-policy" 
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 text-sm underline"
                      >
                        En savoir plus sur notre politique de confidentialité
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium px-6 py-2 flex-1 sm:flex-none"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accepter tout
                  </Button>
                  <Button
                    onClick={acceptEssential}
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-400 dark:text-rose-300 dark:hover:bg-rose-900/20 px-6 py-2 flex-1 sm:flex-none"
                  >
                    Essentiel uniquement
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-6 py-2 flex-1 sm:flex-none"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Personnaliser
                  </Button>
                </div>
              </div>
            ) : (
              /* Panneau de paramètres */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Paramètres des cookies
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Cookies essentiels */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Cookies essentiels
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nécessaires au fonctionnement du site (panier, authentification, sécurité).
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-rose-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Requis</p>
                    </div>
                  </div>

                  {/* Cookies d'analyse */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Cookies d'analyse
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics 
                            ? 'bg-rose-500 justify-end' 
                            : 'bg-gray-300 dark:bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>

                  {/* Cookies marketing */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Cookies marketing
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Pour vous proposer des publicités personnalisées sur nos produits naturels.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.marketing 
                            ? 'bg-rose-500 justify-end' 
                            : 'bg-gray-300 dark:bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>

                  {/* Cookies fonctionnels */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        Cookies fonctionnels
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Améliorent l'expérience avec des fonctions comme le chat en direct.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('functional')}
                        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.functional 
                            ? 'bg-rose-500 justify-end' 
                            : 'bg-gray-300 dark:bg-gray-600 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={savePreferences}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium px-6 py-2 flex-1 sm:flex-none"
                  >
                    Enregistrer mes préférences
                  </Button>
                  <Button
                    onClick={acceptAll}
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-400 dark:text-rose-300 dark:hover:bg-rose-900/20 px-6 py-2 flex-1 sm:flex-none"
                  >
                    Accepter tout
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}