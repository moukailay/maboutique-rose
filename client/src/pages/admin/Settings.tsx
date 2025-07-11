import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Store, CreditCard, Truck, Calculator, Shield, Mail } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettings() {
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ROSE-D\'ÉDEN',
    siteDescription: 'Votre source de produits naturels authentiques et responsables',
    contactEmail: 'contact@rose-d-eden.fr',
    contactPhone: '+33 1 23 45 67 89',
    address: '123 Rue de la Nature, 75001 Paris',
    businessHours: 'Lun-Ven: 9h-18h, Sam: 9h-17h'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalSecret: '',
    bankTransferEnabled: true,
    bankTransferDetails: 'IBAN: FR76 1234 5678 9012 3456 7890 123'
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50,
    standardShippingCost: 5.99,
    expressShippingCost: 12.99,
    internationalShippingEnabled: false,
    internationalShippingCost: 19.99
  });

  const [taxSettings, setTaxSettings] = useState({
    vatRate: 20,
    vatIncluded: true,
    taxCalculationMethod: 'inclusive'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    customerRegistrationNotifications: true
  });

  const handleGeneralSave = () => {
    // In real app, this would save to API
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres généraux ont été mis à jour avec succès.",
    });
  };

  const handlePaymentSave = () => {
    // In real app, this would save to API
    toast({
      title: "Paramètres de paiement sauvegardés",
      description: "Les paramètres de paiement ont été mis à jour avec succès.",
    });
  };

  const handleShippingSave = () => {
    // In real app, this would save to API
    toast({
      title: "Paramètres de livraison sauvegardés",
      description: "Les paramètres de livraison ont été mis à jour avec succès.",
    });
  };

  const handleTaxSave = () => {
    // In real app, this would save to API
    toast({
      title: "Paramètres fiscaux sauvegardés",
      description: "Les paramètres fiscaux ont été mis à jour avec succès.",
    });
  };

  const handleNotificationSave = () => {
    // In real app, this would save to API
    toast({
      title: "Paramètres de notification sauvegardés",
      description: "Les paramètres de notification ont été mis à jour avec succès.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Paramètres</h1>
          <p className="text-text-medium">
            Configurez les paramètres de votre boutique en ligne
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
            <TabsTrigger value="tax">Fiscalité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 h-5 w-5" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Description du site</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Téléphone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessHours">Horaires d'ouverture</Label>
                    <Input
                      id="businessHours"
                      value={generalSettings.businessHours}
                      onChange={(e) => setGeneralSettings({...generalSettings, businessHours: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  />
                </div>

                <Button onClick={handleGeneralSave} className="bg-rose-primary hover:bg-rose-light">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Stripe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stripeEnabled"
                      checked={paymentSettings.stripeEnabled}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, stripeEnabled: checked})}
                    />
                    <Label htmlFor="stripeEnabled">Activer Stripe</Label>
                  </div>

                  {paymentSettings.stripeEnabled && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="stripePublishableKey">Clé publique Stripe</Label>
                        <Input
                          id="stripePublishableKey"
                          value={paymentSettings.stripePublishableKey}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                          placeholder="pk_test_..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="stripeSecretKey">Clé secrète Stripe</Label>
                        <Input
                          id="stripeSecretKey"
                          type="password"
                          value={paymentSettings.stripeSecretKey}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                          placeholder="sk_test_..."
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>PayPal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paypalEnabled"
                      checked={paymentSettings.paypalEnabled}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, paypalEnabled: checked})}
                    />
                    <Label htmlFor="paypalEnabled">Activer PayPal</Label>
                  </div>

                  {paymentSettings.paypalEnabled && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paypalClientId">Client ID PayPal</Label>
                        <Input
                          id="paypalClientId"
                          value={paymentSettings.paypalClientId}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypalClientId: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="paypalSecret">Secret PayPal</Label>
                        <Input
                          id="paypalSecret"
                          type="password"
                          value={paymentSettings.paypalSecret}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypalSecret: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Virement bancaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bankTransferEnabled"
                      checked={paymentSettings.bankTransferEnabled}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, bankTransferEnabled: checked})}
                    />
                    <Label htmlFor="bankTransferEnabled">Activer le virement bancaire</Label>
                  </div>

                  {paymentSettings.bankTransferEnabled && (
                    <div>
                      <Label htmlFor="bankTransferDetails">Détails bancaires</Label>
                      <Textarea
                        id="bankTransferDetails"
                        value={paymentSettings.bankTransferDetails}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankTransferDetails: e.target.value})}
                        rows={3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handlePaymentSave} className="bg-rose-primary hover:bg-rose-light">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les paramètres de paiement
              </Button>
            </div>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Paramètres de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="freeShippingThreshold">Seuil de livraison gratuite (CAD)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="standardShippingCost">Coût livraison standard (CAD)</Label>
                    <Input
                      id="standardShippingCost"
                      type="number"
                      step="0.01"
                      value={shippingSettings.standardShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, standardShippingCost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expressShippingCost">Coût livraison express (CAD)</Label>
                    <Input
                      id="expressShippingCost"
                      type="number"
                      step="0.01"
                      value={shippingSettings.expressShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, expressShippingCost: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="internationalShippingCost">Coût livraison internationale (CAD)</Label>
                    <Input
                      id="internationalShippingCost"
                      type="number"
                      step="0.01"
                      value={shippingSettings.internationalShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, internationalShippingCost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="internationalShippingEnabled"
                    checked={shippingSettings.internationalShippingEnabled}
                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, internationalShippingEnabled: checked})}
                  />
                  <Label htmlFor="internationalShippingEnabled">Activer la livraison internationale</Label>
                </div>

                <Button onClick={handleShippingSave} className="bg-rose-primary hover:bg-rose-light">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres de livraison
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Settings */}
          <TabsContent value="tax">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Paramètres fiscaux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      value={taxSettings.vatRate}
                      onChange={(e) => setTaxSettings({...taxSettings, vatRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vatIncluded"
                      checked={taxSettings.vatIncluded}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, vatIncluded: checked})}
                    />
                    <Label htmlFor="vatIncluded">Prix TTC (TVA incluse)</Label>
                  </div>
                </div>

                <Button onClick={handleTaxSave} className="bg-rose-primary hover:bg-rose-light">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres fiscaux
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Paramètres de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                    <Label htmlFor="emailNotifications">Notifications par email</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderNotifications: checked})}
                    />
                    <Label htmlFor="orderNotifications">Notifications de nouvelles commandes</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stockAlerts"
                      checked={notificationSettings.stockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, stockAlerts: checked})}
                    />
                    <Label htmlFor="stockAlerts">Alertes de stock faible</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customerRegistrationNotifications"
                      checked={notificationSettings.customerRegistrationNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, customerRegistrationNotifications: checked})}
                    />
                    <Label htmlFor="customerRegistrationNotifications">Notifications d'inscription client</Label>
                  </div>
                </div>

                <Button onClick={handleNotificationSave} className="bg-rose-primary hover:bg-rose-light">
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les paramètres de notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}