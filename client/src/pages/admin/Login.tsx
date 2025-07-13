import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@rose-d-eden.fr');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Appel direct à l'API sans passer par le hook useAuth
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Email ou mot de passe incorrect.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Keep default message if response is not JSON
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const { token, user: userData } = responseData;
      
      // Stocker le token
      localStorage.setItem('authToken', token);
      
      // Afficher le message de succès
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration!",
      });

      // Redirection multiple avec méthodes de fallback
      try {
        // Méthode 1: Utilisation de l'history API
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '/admin/dashboard');
          window.location.reload();
        } else {
          // Méthode 2: Redirection classique
          window.location.href = '/admin/dashboard';
        }
      } catch (error) {
        // Méthode 3: Fallback final
        console.error('Redirection error:', error);
        window.location.assign('/admin/dashboard');
      }
      
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      toast({
        title: "Erreur de connexion",
        description: err.message || "Identifiants invalides",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-rose-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Connexion Administrateur
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accédez à l'interface d'administration Rose D'É
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion sécurisée</CardTitle>
            <CardDescription>
              Entrez vos identifiants administrateur pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email administrateur</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="mt-1"
                    placeholder="admin@rose-d-eden.fr"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Identifiants par défaut:
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Email: admin@rose-d-eden.fr<br />
                Mot de passe: admin123
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setLocation('/')}
            className="text-sm"
          >
            ← Retour au site
          </Button>
        </div>
      </div>
    </div>
  );
}