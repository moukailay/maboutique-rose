import { useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function AdminRedirect() {
  useEffect(() => {
    // Vérifier le token d'authentification
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Redirection vers le dashboard admin
      window.location.href = '/admin/dashboard';
    } else {
      // Redirection vers la page de login
      window.location.href = '/admin/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Shield className="mx-auto h-16 w-16 text-rose-600 animate-pulse" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Redirection en cours...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Veuillez patienter pendant que nous vous redirigeons.
        </p>
      </div>
    </div>
  );
}