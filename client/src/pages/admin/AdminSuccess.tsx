import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function AdminSuccess() {
  useEffect(() => {
    // Redirection automatique vers le dashboard après 3 secondes
    const timer = setTimeout(() => {
      window.location.href = '/admin/dashboard';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connexion réussie !
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes maintenant connecté à l'interface d'administration.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Redirection automatique vers le dashboard...
        </p>
        <div className="mt-6">
          <a 
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Accéder au dashboard
          </a>
        </div>
      </div>
    </div>
  );
}