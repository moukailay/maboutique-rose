import { createContext, useContext } from 'react';

export type Language = 'fr' | 'en';

export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Translations object
export const translations = {
  fr: {
    // Header
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cart': 'Panier',
    'nav.login': 'Se connecter',
    'nav.register': 'S\'inscrire',
    'nav.logout': 'Déconnexion',
    'nav.admin': 'Admin',
    'nav.profile': 'Profil',

    // Home page
    'home.hero.title': 'Bienvenue chez ROSE-D\'ÉDEN',
    'home.hero.subtitle': 'Votre source de produits naturels authentiques et responsables.',
    'home.hero.cta': 'Découvrir nos produits',
    'home.featured.title': 'Nos produits naturels vedettes',
    'home.featured.subtitle': 'Découvrez notre sélection de produits naturels soigneusement choisis pour leur qualité et leur authenticité.',
    'home.featured.cta': 'Voir tous les produits',
    'home.about.title': 'Notre engagement pour la nature',
    'home.about.text': 'Depuis plus de 10 ans, nous nous engageons à vous offrir des produits naturels d\'exception, sélectionnés avec soin auprès de producteurs locaux et responsables.',
    'home.about.eco': 'Engagement écologique et durable',
    'home.about.quality': 'Origine et qualité garanties',
    'home.about.social': 'Responsabilité sociale',
    'home.about.cta': 'En savoir plus',

    // Products
    'products.title': 'Nos Produits Naturels',
    'products.search': 'Rechercher des produits...',
    'products.filter.all': 'Toutes les catégories',
    'products.sort.name': 'Nom',
    'products.sort.price': 'Prix',
    'products.sort.newest': 'Plus récent',
    'products.loading': 'Chargement des produits...',
    'products.empty': 'Aucun produit trouvé',
    'products.add_to_cart': 'Ajouter au panier',

    // Categories
    'categories': 'Catégories',
    'all_products': 'Tous les produits',

    // Cart
    'cart.title': 'Mon Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.empty.text': 'Découvrez nos produits naturels pour commencer vos achats.',
    'cart.empty.cta': 'Voir les produits',
    'cart.item.quantity': 'Quantité',
    'cart.item.remove': 'Retirer',
    'cart.subtotal': 'Sous-total',
    'cart.checkout': 'Passer commande',
    'cart.continue_shopping': 'Continuer mes achats',

    // Authentication
    'auth.login.title': 'Connexion',
    'auth.login.email': 'Email',
    'auth.login.password': 'Mot de passe',
    'auth.login.submit': 'Se connecter',
    'auth.login.register_link': 'Pas encore de compte ? S\'inscrire',
    'auth.register.title': 'Inscription',
    'auth.register.first_name': 'Prénom',
    'auth.register.last_name': 'Nom',
    'auth.register.email': 'Email',
    'auth.register.password': 'Mot de passe',
    'auth.register.submit': 'S\'inscrire',
    'auth.register.login_link': 'Déjà un compte ? Se connecter',

    // Admin
    'admin.dashboard': 'Tableau de bord',
    'admin.products': 'Produits',
    'admin.orders': 'Commandes',
    'admin.customers': 'Clients',
    'admin.settings': 'Paramètres',
    'admin.logout': 'Déconnexion',

    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.price': 'Prix',
    'common.name': 'Nom',
    
    // Themes
    'theme.light': 'Thème clair',
    'theme.dark': 'Thème sombre',
    'theme.toggle': 'Basculer le thème',
    
    // Chat
    'chat.title': 'Assistance Client',
    'chat.subtitle': 'Nous sommes là pour vous aider',
    'chat.online_status': 'En ligne',
    'chat.help_tooltip': 'Besoin d\'aide ? Cliquez pour discuter',
    'chat.welcome': 'Bonjour ! 👋 Bienvenue chez ROSE-D\'ÉDEN. Comment puis-je vous aider aujourd\'hui ?',
    'chat.welcome_options': 'Je peux vous renseigner sur nos produits naturels, les prix, la livraison, ou toute autre question !',
    'chat.placeholder': 'Tapez votre message...',
    'chat.send': 'Envoyer',
    'chat.powered_by': 'Propulsé par',
    'chat.auto_response': 'Merci pour votre message ! Un membre de notre équipe vous répondra rapidement.',
    'chat.response_pricing': 'Excellente question ! Tous nos prix sont affichés en dollars canadiens. Avez-vous un produit spécifique en tête ?',
    'chat.response_shipping': 'Nous livrons partout au Québec ! La livraison est gratuite pour les commandes de 75$ et plus. Délai habituel : 2-3 jours ouvrables.',
    'chat.response_products': 'Nos produits sont 100% naturels et certifiés bio. Quel type de produit vous intéresse ? Miel, huiles essentielles, cosmétiques naturels ?',
    'chat.response_order': 'Parfait ! Vous pouvez commander directement sur notre site. Besoin d\'aide pour naviguer ou avez-vous des questions sur un produit spécifique ?',
    'common.email': 'Email',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse',
    'common.status': 'Statut',
    'common.actions': 'Actions',
    'common.date': 'Date',
    'common.total': 'Total',
    'common.currency': 'CAD',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.admin': 'Admin',
    'nav.profile': 'Profile',

    // Home page
    'home.hero.title': 'Welcome to ROSE-D\'ÉDEN',
    'home.hero.subtitle': 'Your source for authentic and responsible natural products.',
    'home.hero.cta': 'Discover our products',
    'home.featured.title': 'Our featured natural products',
    'home.featured.subtitle': 'Discover our selection of natural products carefully chosen for their quality and authenticity.',
    'home.featured.cta': 'View all products',
    'home.about.title': 'Our commitment to nature',
    'home.about.text': 'For more than 10 years, we have been committed to offering you exceptional natural products, carefully selected from local and responsible producers.',
    'home.about.eco': 'Ecological and sustainable commitment',
    'home.about.quality': 'Guaranteed origin and quality',
    'home.about.social': 'Social responsibility',
    'home.about.cta': 'Learn more',

    // Products
    'products.title': 'Our Natural Products',
    'products.search': 'Search products...',
    'products.filter.all': 'All categories',
    'products.sort.name': 'Name',
    'products.sort.price': 'Price',
    'products.sort.newest': 'Newest',
    'products.loading': 'Loading products...',
    'products.empty': 'No products found',
    'products.add_to_cart': 'Add to cart',

    // Categories
    'categories': 'Categories',
    'all_products': 'All products',

    // Cart
    'cart.title': 'My Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty.text': 'Discover our natural products to start shopping.',
    'cart.empty.cta': 'View products',
    'cart.item.quantity': 'Quantity',
    'cart.item.remove': 'Remove',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Checkout',
    'cart.continue_shopping': 'Continue shopping',

    // Authentication
    'auth.login.title': 'Login',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.submit': 'Login',
    'auth.login.register_link': 'Don\'t have an account? Register',
    'auth.register.title': 'Register',
    'auth.register.first_name': 'First Name',
    'auth.register.last_name': 'Last Name',
    'auth.register.email': 'Email',
    'auth.register.password': 'Password',
    'auth.register.submit': 'Register',
    'auth.register.login_link': 'Already have an account? Login',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.customers': 'Customers',
    'admin.settings': 'Settings',
    'admin.logout': 'Logout',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.name': 'Name',
    
    // Themes
    'theme.light': 'Light theme',
    'theme.dark': 'Dark theme',
    'theme.toggle': 'Toggle theme',
    
    // Chat
    'chat.title': 'Customer Support',
    'chat.subtitle': 'We\'re here to help you',
    'chat.online_status': 'Online',
    'chat.help_tooltip': 'Need help? Click to chat',
    'chat.welcome': 'Hello! 👋 Welcome to ROSE-D\'ÉDEN. How can I help you today?',
    'chat.welcome_options': 'I can help you with our natural products, pricing, shipping, or any other questions!',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.powered_by': 'Powered by',
    'chat.auto_response': 'Thank you for your message! A member of our team will respond quickly.',
    'chat.response_pricing': 'Great question! All our prices are displayed in Canadian dollars. Do you have a specific product in mind?',
    'chat.response_shipping': 'We deliver throughout Quebec! Free shipping on orders over $75. Usual delivery time: 2-3 business days.',
    'chat.response_products': 'Our products are 100% natural and certified organic. What type of product interests you? Honey, essential oils, natural cosmetics?',
    'chat.response_order': 'Perfect! You can order directly on our website. Need help navigating or have questions about a specific product?',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.date': 'Date',
    'common.total': 'Total',
    'common.currency': 'CAD',
  }
};