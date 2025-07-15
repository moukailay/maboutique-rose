import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSuccess() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    // Vérifier le token avant la redirection
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setVerificationError('Token manquant');
      setIsVerifying(false);
      setTimeout(() => window.location.href = '/admin/login', 2000);
      return;
    }

    // Vérifier la validité du token
    console.log('Vérification du token:', token);
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (response.ok) {
        // Token valide, s'assurer qu'il est bien stocké et rediriger
        console.log('Token valide, redirection vers dashboard');
        
        // Vérifier et re-stocker le token si nécessaire
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
          console.log('Token manquant, le remettre');
          localStorage.setItem('authToken', token);
        }
        
        // Utiliser une redirection simple et directe
        setTimeout(() => {
          window.location.replace('/admin/dashboard');
        }, 500);
      } else {
        throw new Error(`Token invalide (status: ${response.status})`);
      }
    })
    .catch(error => {
      console.error('Erreur de vérification:', error);
      setVerificationError(`Erreur de vérification: ${error.message}`);
      localStorage.removeItem('authToken');
      setTimeout(() => window.location.href = '/admin/login', 2000);
    })
    .finally(() => {
      setIsVerifying(false);
    });
  }, []);

  if (verificationError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de vérification
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {verificationError}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

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
          {isVerifying ? 'Vérification en cours...' : 'Redirection automatique vers le dashboard...'}
        </p>
        {!isVerifying && (
          <div className="mt-6">
            <button
              onClick={() => {
                const dashboardUrl = `${window.location.origin}/admin/dashboard`;
                window.location.href = dashboardUrl;
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Accéder au dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}