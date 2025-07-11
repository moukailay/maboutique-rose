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
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const { token, user: userData } = response;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${userData.firstName} !`,
      });

      // Redirect based on role
      if (userData.role === 'admin') {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      const { token, user: newUser } = response;
      
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
        description: "Veuillez vérifier vos informations.",
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