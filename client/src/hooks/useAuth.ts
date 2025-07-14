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
    // Check for existing token on mount
    const token = localStorage.getItem('authToken');
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

  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/login';
      const response = await fetch(endpoint, {
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
          // If response is not JSON, keep default message
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const { token, user: userData } = responseData;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userData.firstName} !`,
      });

      // Redirect based on role and current location
      if (userData.role === 'admin') {
        // Si on est sur la page admin login, rediriger vers success
        if (window.location.pathname === '/admin/login') {
          // Ne pas rediriger ici, c'est géré par la page AdminLogin
          return;
        } else {
          // Si admin se connecte depuis la page publique, rediriger vers admin
          setLocation('/admin/dashboard');
        }
      } else {
        setLocation('/');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Email ou mot de passe incorrect.",
        variant: "destructive",
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