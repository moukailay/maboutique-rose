import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Mentions légales</h1>
          <p className="text-muted-foreground">
            Informations légales conformément à la loi canadienne
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Informations sur l'entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Raison sociale</h4>
                  <p>Rose-d'Éden Inc.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Forme juridique</h4>
                  <p>Société par actions simplifiée</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Numéro d'entreprise</h4>
                  <p>123456789 RC0001</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">TVQ/TPS</h4>
                  <p>TPS : 123456789RT0001<br />TVQ : 1234567890TQ0001</p>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="font-semibold mb-2">Adresse du siège social</h4>
                <p>
                  123 rue des Érables<br />
                  Montréal, Québec H2X 1N7<br />
                  Canada
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Directeur de la publication</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Directrice :</strong> Marie Dubois<br />
                <strong>Fonction :</strong> Présidente-directrice générale<br />
                <strong>Email :</strong> direction@rose-d-eden.fr
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Hébergement du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Hébergeur</h4>
                <p>
                  Replit Inc.<br />
                  767 Bryant St #203<br />
                  San Francisco, CA 94107<br />
                  États-Unis
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Serveurs</h4>
                <p>
                  Les serveurs sont hébergés dans des centres de données sécurisés 
                  respectant les normes internationales de sécurité.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Activités de l'entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Rose-d'Éden est spécialisée dans la vente de produits naturels et biologiques :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Miel et produits de la ruche artisanaux</li>
                <li>Huiles essentielles pures certifiées biologiques</li>
                <li>Tisanes et infusions à base de plantes naturelles</li>
                <li>Cosmétiques naturels sans produits chimiques</li>
                <li>Compléments alimentaires d'origine naturelle</li>
              </ul>
              <p className="mt-4">
                <strong>Certification biologique :</strong> Certifié par Ecocert Canada (ECO-123456)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le site www.rose-d-eden.fr et l'ensemble de son contenu (textes, images, vidéos, 
                logos, graphismes) sont protégés par les droits d'auteur et de propriété 
                intellectuelle au Canada.
              </p>
              <p>
                La marque "Rose-d'Éden" est déposée auprès de l'Office de la propriété 
                intellectuelle du Canada (OPIC).
              </p>
              <p>
                Toute reproduction, même partielle, est interdite sans autorisation préalable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Conformément à la Loi sur la protection des renseignements personnels et les 
                documents électroniques (LPRPDE) du Canada, vous disposez d'un droit d'accès, 
                de rectification et de suppression des données vous concernant.
              </p>
              <p>
                Pour exercer ces droits, contactez-nous à : privacy@rose-d-eden.fr
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies et traceurs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le site utilise des cookies techniques nécessaires au bon fonctionnement 
                du site et des cookies analytiques pour améliorer l'expérience utilisateur.
              </p>
              <p>
                Vous pouvez paramétrer l'utilisation des cookies dans votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Droit applicable et juridiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Les présentes mentions légales sont soumises au droit canadien et québécois. 
                En cas de litige, les tribunaux de Montréal sont seuls compétents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Service client :</strong> contact@rose-d-eden.fr</p>
                <p><strong>Questions juridiques :</strong> legal@rose-d-eden.fr</p>
                <p><strong>Protection des données :</strong> privacy@rose-d-eden.fr</p>
                <p><strong>Téléphone :</strong> +1 (438) 555-ROSE (7673)</p>
                <p><strong>Horaires :</strong> Lundi au vendredi, 9h à 17h (EST)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}