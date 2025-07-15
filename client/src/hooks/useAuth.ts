import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // On tente finalToken ➜ adminToken ➜ authToken (du plus sûr au plus simple)
    const token =
      localStorage.getItem('finalToken')  ||
      localStorage.getItem('adminToken')  ||
      localStorage.getItem('authToken');

    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------
  // Hook d’authentification : login (version corrigée)
  // -----------------------------------------------------------------------------
  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      // 1️⃣ Endpoint selon le contexte (admin vs public)
      const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/login';

      // 2️⃣ Requête HTTP
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // 3️⃣ Gestion d’erreur
      if (!response.ok) {
        let msg = 'Email ou mot de passe incorrect.';
        try {
          const { message } = await response.json();
          if (message) msg = message;
        } catch {/* réponse non-JSON */}
        throw new Error(msg);
      }

      // 4️⃣ Données renvoyées
      const { token, user: userData } = await response.json();

      // 5️⃣ Stockage des jetons ================================================
      /**
       * • authToken  : toujours présent (facilite verifyToken côté public)
       * • adminToken : nécessaire pour le flux /admin/success
       */
      localStorage.setItem('authToken', token);
      if (userData.role === 'admin') {
        localStorage.setItem('adminToken', token);
      }

      // 6️⃣ Contexte + toast
      setUser(userData);
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${userData.firstName} !`,
      });

      // 7️⃣ Redirection =========================================================
      if (userData.role === 'admin') {
        /**
         * • Depuis /admin/login  (isAdmin = true) :
         *   la page a déjà son propre `window.location.href = '/admin/success'`
         *   donc on ne touche à rien.
         *
         * • Depuis /login (isAdmin = false) :
         *   on déclenche nous-mêmes /admin/success pour échanger adminToken
         *   contre finalToken avant d’entrer dans le dashboard.
         */
        if (!isAdmin) setLocation('/admin/success');
      } else {
        setLocation('/'); // utilisateur classique
      }
    }
    //---------------------------------------------------------------------------
    catch (error) {
      toast({
        title: 'Erreur de connexion',
        description:
          error instanceof Error ? error.message : 'Email ou mot de passe incorrect.',
        variant: 'destructive',
      });
      throw error;
    }
  };


  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = "Une erreur est survenue lors de la création du compte.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, keep default message
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const { token, user: newUser } = responseData;
      
      localStorage.setItem('authToken', token);
      setUser(newUser);
      
      toast({
        title: "Compte créé avec succès",
        description: `Bienvenue ${newUser.firstName} !`,
      });

      setLocation('/');
    } catch (error) {
      toast({
        title: "Erreur lors de l'inscription",
        description: error instanceof Error ? error.message : "Veuillez vérifier vos informations.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    
    setLocation('/');
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };
}