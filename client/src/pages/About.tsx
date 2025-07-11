import { Leaf, Tag, Handshake, Users, Globe, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            À propos de Natura
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            Depuis plus de 10 ans, nous nous engageons à vous offrir des produits naturels d'exception, 
            sélectionnés avec soin auprès de producteurs locaux et responsables.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Agriculture durable"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-text-dark mb-6">
              Notre Mission
            </h2>
            <p className="text-lg text-text-medium mb-6">
              Chez Natura, nous croyons que la nature nous offre tout ce dont nous avons besoin pour 
              prendre soin de nous-mêmes et de notre environnement. Notre mission est de vous connecter 
              avec les meilleurs produits naturels, authentiques et responsables.
            </p>
            <p className="text-lg text-text-medium">
              Nous travaillons directement avec des producteurs locaux qui partagent nos valeurs 
              d'authenticité, de qualité et de respect de l'environnement.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Engagement Écologique
                </h3>
                <p className="text-text-medium">
                  Nous privilégions les produits biologiques et les pratiques durables 
                  pour préserver notre planète.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Qualité Garantie
                </h3>
                <p className="text-text-medium">
                  Chaque produit est rigoureusement sélectionné et testé pour vous assurer 
                  une qualité exceptionnelle.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  Commerce Équitable
                </h3>
                <p className="text-text-medium">
                  Nous soutenons les producteurs locaux et pratiquons un commerce 
                  juste et équitable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-text-dark mb-6">
              Notre Histoire
            </h2>
            <p className="text-lg text-text-medium mb-6">
              Fondée en 2014 par une équipe passionnée de nature et de bien-être, 
              Natura a commencé comme une petite boutique locale spécialisée dans 
              les produits naturels.
            </p>
            <p className="text-lg text-text-medium mb-6">
              Au fil des années, nous avons développé un réseau de partenaires 
              producteurs partageant nos valeurs, nous permettant aujourd'hui 
              de vous proposer une gamme complète de produits authentiques.
            </p>
            <p className="text-lg text-text-medium">
              Aujourd'hui, nous sommes fiers de servir des milliers de clients 
              qui font confiance à notre expertise et à notre engagement pour 
              la qualité.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Équipe Natura"
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark text-center mb-12">
            Natura en Chiffres
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest-green mb-2">10 000+</div>
              <p className="text-text-medium">Clients satisfaits</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest-green mb-2">50+</div>
              <p className="text-text-medium">Producteurs partenaires</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-forest-green mb-2">10</div>
              <p className="text-text-medium">Années d'expérience</p>
            </div>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="text-center bg-forest-green text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Notre Engagement</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Nous nous engageons à continuer de vous offrir les meilleurs produits naturels 
            tout en respectant notre environnement et en soutenant les communautés locales.
          </p>
          <p className="text-lg opacity-90">
            Merci de faire partie de cette aventure avec nous !
          </p>
        </div>
      </div>
    </div>
  );
}
