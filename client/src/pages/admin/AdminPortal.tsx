import { useEffect } from 'react';

export default function AdminPortal() {
  useEffect(() => {
    // Vérifier le token et rediriger immédiatement
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Pas de token, rediriger vers login
      window.location.href = '/admin/login';
      return;
    }

    // Token présent, rediriger vers dashboard
    window.location.href = '/admin/dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Redirection en cours...
        </p>
      </div>
    </div>
  );
}