import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Conditions générales de vente</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Objet et champ d'application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les présentes conditions générales de vente s'appliquent à toutes les ventes de produits 
                naturels (miel, huiles essentielles, tisanes, cosmétiques naturels) effectuées par 
                Rose-d'Éden sur le site www.rose-d-eden.fr.
              </p>
              <p>
                Toute commande implique l'acceptation sans réserve des présentes conditions générales 
                de vente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Produits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rose-d'Éden propose une gamme de produits naturels et biologiques :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Miel artisanal et produits de la ruche</li>
                <li>Huiles essentielles pures et biologiques</li>
                <li>Tisanes et infusions naturelles</li>
                <li>Cosmétiques naturels sans produits chimiques</li>
                <li>Compléments alimentaires naturels</li>
              </ul>
              <p>
                Tous nos produits sont sélectionnés avec soin et respectent les normes de qualité 
                les plus strictes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Prix et modalités de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les prix sont indiqués en dollars canadiens (CAD) toutes taxes comprises. 
                Les prix peuvent être modifiés à tout moment sans préavis.
              </p>
              <p>
                Les modes de paiement acceptés sont :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Carte bancaire (Visa, Mastercard, American Express)</li>
                <li>Paiement sécurisé via Stripe</li>
              </ul>
              <p>
                Le paiement est exigible immédiatement lors de la commande.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Commande et confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                La commande n'est définitive qu'après confirmation du paiement. Un email de 
                confirmation vous sera envoyé avec les détails de votre commande.
              </p>
              <p>
                Nous nous réservons le droit d'annuler toute commande en cas d'indisponibilité 
                du produit ou de problème de paiement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les livraisons sont effectuées au Canada uniquement. Les délais de livraison 
                sont de 3 à 7 jours ouvrables selon votre localisation.
              </p>
              <p>
                Les frais de livraison sont calculés en fonction du poids et de la destination. 
                Livraison gratuite pour les commandes de plus de 75 CAD.
              </p>
              <p>
                En cas de produits périssables (miel frais, cosmétiques), nous garantissons 
                une livraison rapide pour préserver la qualité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Droit de rétractation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation 
                sans avoir à justifier de motifs ni à payer de pénalités.
              </p>
              <p>
                Exception : Les produits périssables ou d'hygiène (cosmétiques ouverts) ne 
                peuvent être retournés pour des raisons de santé.
              </p>
              <p>
                Les frais de retour sont à votre charge, sauf si le produit est défectueux.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Garantie et qualité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tous nos produits naturels sont garantis contre les défauts de fabrication. 
                En cas de problème de qualité, nous procédons au remplacement ou au remboursement.
              </p>
              <p>
                Nos produits biologiques sont certifiés par des organismes reconnus. 
                Les analyses de qualité sont disponibles sur demande.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rose-d'Éden ne peut être tenue responsable des dommages résultant d'un usage 
                inapproprié des produits naturels.
              </p>
              <p>
                Il est recommandé de consulter un professionnel de santé avant l'utilisation 
                d'huiles essentielles ou de compléments alimentaires.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact et réclamations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Pour toute question ou réclamation, contactez notre service client :
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li>📧 Email : contact@rose-d-eden.fr</li>
                <li>📞 Téléphone : +1 (438) 555-ROSE</li>
                <li>📍 Adresse : 123 rue des Érables, Montréal, QC H2X 1N7</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}