import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/contact', formData);
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            Une question ? Un conseil ? Notre équipe est là pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-text-dark">
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-text-dark">
                    Nom complet *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-text-dark">
                    Adresse email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-text-dark">
                    Sujet *
                  </Label>
                  <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choisir un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Demande générale</SelectItem>
                      <SelectItem value="product">Question produit</SelectItem>
                      <SelectItem value="order">Problème commande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-text-dark">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={6}
                    className="mt-1 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rose-primary hover:bg-rose-light"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-text-dark">
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-dark">Adresse</h3>
                    <p className="text-text-medium">123 Rue de la Nature, 75001 Paris</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-dark">Téléphone</h3>
                    <p className="text-text-medium">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-dark">Email</h3>
                    <p className="text-text-medium">contact@rose-d-eden.fr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-text-dark flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-text-dark">Lundi - Vendredi</span>
                    <span className="text-text-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-dark">Samedi</span>
                    <span className="text-text-medium">9h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-dark">Dimanche</span>
                    <span className="text-text-medium">Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-forest-green text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Nous vous répondons rapidement</h3>
                <p className="text-gray-100">
                  Notre équipe s'engage à vous répondre dans les 24 heures ouvrées. 
                  Pour les questions urgentes, n'hésitez pas à nous appeler directement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
