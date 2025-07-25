import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Politique de confidentialité</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Collecte des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rose-d'Éden collecte des informations lorsque vous vous inscrivez sur notre site, 
                passez une commande, vous abonnez à notre newsletter ou remplissez un formulaire.
              </p>
              <p>
                Les informations collectées peuvent inclure votre nom, adresse e-mail, adresse postale, 
                numéro de téléphone et informations de paiement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Utilisation des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Les informations que nous collectons auprès de vous peuvent être utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Traiter vos commandes et gérer votre compte</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Vous envoyer des informations sur nos produits naturels</li>
                <li>Répondre à vos questions et demandes de support</li>
                <li>Vous envoyer notre newsletter (avec votre consentement)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Protection des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous mettons en place diverses mesures de sécurité pour préserver la sécurité de vos 
                informations personnelles. Nous utilisons un cryptage sécurisé pour protéger les 
                informations sensibles transmises en ligne.
              </p>
              <p>
                Vos informations personnelles sont stockées dans des réseaux sécurisés et ne sont 
                accessibles qu'à un nombre limité de personnes ayant des droits d'accès spéciaux.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Cookies et technologies similaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rose-d'Éden utilise différents types de cookies pour améliorer votre expérience de navigation :
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Cookies essentiels</h4>
                  <p className="text-sm text-muted-foreground">
                    Nécessaires au fonctionnement du site (panier d'achat, authentification, sécurité). 
                    Ces cookies ne peuvent pas être désactivés.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Cookies d'analyse</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous aident à comprendre comment vous utilisez notre site pour l'améliorer 
                    (pages visitées, temps passé, erreurs rencontrées).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Cookies marketing</h4>
                  <p className="text-sm text-muted-foreground">
                    Permettent de vous proposer des publicités personnalisées sur nos produits naturels 
                    selon vos centres d'intérêt.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Cookies fonctionnels</h4>
                  <p className="text-sm text-muted-foreground">
                    Améliorent l'expérience utilisateur avec des fonctions comme le chat en direct 
                    et la mémorisation de vos préférences linguistiques.
                  </p>
                </div>
              </div>
              <p>
                Vous pouvez gérer vos préférences de cookies via la bannière qui apparaît lors de 
                votre première visite ou en modifiant les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Partage des informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles 
                identifiables à des tiers sans votre consentement, sauf dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prestataires de services de confiance qui nous aident à exploiter notre site</li>
                <li>Obligations légales ou réglementaires</li>
                <li>Protection de nos droits, propriété ou sécurité</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Conformément au RGPD, vous avez le droit de :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données inexactes</li>
                <li>Supprimer vos données dans certaines circonstances</li>
                <li>Limiter le traitement de vos données</li>
                <li>Vous opposer au traitement de vos données</li>
                <li>Portabilité de vos données</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous 
                contacter à : contact@rose-d-eden.fr
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}