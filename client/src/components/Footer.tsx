import { useState } from 'react';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Linkedin, Leaf } from 'lucide-react';
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
    <footer className="bg-text-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-rose-primary" />
              <span className="text-xl font-bold">ROSE-D'ÉDEN</span>
            </div>
            <p className="text-gray-300 mb-4">
              Votre source de produits naturels authentiques et responsables depuis plus de 10 ans.
            </p>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Notre histoire</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Nos valeurs</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-white transition-colors">Panier</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Conditions générales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Recevez nos dernières actualités et offres spéciales.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-rose-primary"
                required
              />
              <Button
                type="submit"
                className="w-full bg-rose-primary hover:bg-rose-light"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'En cours...' : "S'inscrire"}
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <p>📍 123 Rue de la Nature, 75001 Paris</p>
              <p>📞 +33 1 23 45 67 89</p>
              <p>✉️ contact@natura.fr</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ROSE-D'ÉDEN. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
