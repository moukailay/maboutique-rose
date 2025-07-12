import { useState } from 'react';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Linkedin, Leaf, MessageCircle, Phone, Mail, MapPin, Camera, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await apiRequest('POST', '/api/newsletter', { email });
      toast({
        title: "Inscription réussie !",
        description: "Merci de vous être inscrit à notre newsletter.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
                ROSE-D'ÉDEN
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Votre source de produits naturels authentiques et responsables. Découvrez notre gamme de produits de bien-être naturels.
            </p>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">À propos</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Notre histoire
              </Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Nos valeurs
              </Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact
              </Link></li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Navigation</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Accueil
              </Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Produits
              </Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Catégories
              </Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-rose-400 transition-colors flex items-center group">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Panier
              </Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">123 Rue de la Nature</p>
                  <p className="text-gray-300 text-sm">Montréal, QC</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">+1 (438) 988-2625</p>
                  <p className="text-gray-300 text-sm">+1 (438) 828-2185</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Rosededen29062019@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">WhatsApp</p>
                  <p className="text-gray-300 text-sm">+1 (438) 988-2625</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter & Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Newsletter</h3>
            <p className="text-gray-300 mb-4">Recevez nos dernières actualités et offres spéciales.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700/50 text-white border-gray-600 focus:border-rose-400 focus:ring-rose-400"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'En cours...' : "S'inscrire"}
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-rose-400">Suivez-nous</h4>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://instagram.com/Rosededen1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-rose-500/20 transition-all duration-200 group"
                >
                  <Instagram className="h-4 w-4 text-pink-400 group-hover:text-rose-400" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Instagram</span>
                </a>
                
                <a
                  href="https://facebook.com/Rose-D-Eden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group"
                >
                  <Facebook className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Facebook</span>
                </a>
                
                <a
                  href="https://tiktok.com/@Rosededen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-purple-500/20 transition-all duration-200 group"
                >
                  <Camera className="h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                  <span className="text-xs text-gray-300 group-hover:text-white">TikTok</span>
                </a>
                
                <a
                  href="https://snapchat.com/add/Rosededen1503"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 group"
                >
                  <Users className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Snapchat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2025 ROSE-D'ÉDEN. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-rose-400 transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Conditions générales</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
