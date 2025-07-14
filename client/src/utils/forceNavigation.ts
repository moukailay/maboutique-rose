// Utilitaire pour forcer la navigation admin
export function forceAdminNavigation() {
  console.log('Force navigation vers admin dashboard');
  
  // Méthode 1: Changer complètement l'URL
  window.location.href = '/admin/dashboard';
  
  // Méthode 2: Fallback avec replace
  setTimeout(() => {
    if (window.location.pathname !== '/admin/dashboard') {
      console.log('Fallback: utilisation de replace');
      window.location.replace('/admin/dashboard');
    }
  }, 100);
  
  // Méthode 3: Fallback avec reload complet
  setTimeout(() => {
    if (window.location.pathname !== '/admin/dashboard') {
      console.log('Fallback: reload complet');
      window.location.assign('/admin/dashboard');
    }
  }, 200);
}