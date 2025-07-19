import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Users, Camera, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/hooks/useTranslation";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("/api/contact", { method: "POST", data: formData });
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('contact.form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">
                    {t('contact.form.name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-900 dark:text-white">
                    {t('contact.form.subject')}
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleChange("subject", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('contact.form.subject_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t('contact.form.subject_general')}</SelectItem>
                      <SelectItem value="product">{t('contact.form.subject_product')}</SelectItem>
                      <SelectItem value="order">{t('contact.form.subject_order')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-900 dark:text-white">
                    {t('contact.form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
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
                  {isSubmitting ? "Envoi en cours..." : t('contact.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg bg-white dark:bg-gray-800 border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Adresse</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Rue de la Nature, 2627 Montréal{" "}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+1 (438) 988-2625</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (438) 828-2185</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">Rosededen29062019@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">WhatsApp</h3>
                    <p className="text-gray-600 dark:text-gray-300">+1 (438) 988-2625</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white dark:bg-gray-800 border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white">Lundi - Vendredi</span>
                    <span className="text-gray-600 dark:text-gray-300">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white">Samedi</span>
                    <span className="text-gray-600 dark:text-gray-300">9h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white">Dimanche</span>
                    <span className="text-gray-600 dark:text-gray-300">Fermé</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">
                  Suivez-nous sur les réseaux sociaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://instagram.com/Rosededen1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                  
                  <a
                    href="https://facebook.com/Rose-D-Eden"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="text-sm font-medium">Facebook</span>
                  </a>
                  
                  <a
                    href="https://tiktok.com/@Rosededen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-sm font-medium">TikTok</span>
                  </a>
                  
                  <a
                    href="https://snapchat.com/add/Rosededen1503"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">Snapchat</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Nous vous répondons rapidement
                </h3>
                <p className="text-gray-100">
                  Notre équipe s'engage à vous répondre dans les 24 heures
                  ouvrées. Pour les questions urgentes, contactez-nous directement
                  par téléphone ou WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
