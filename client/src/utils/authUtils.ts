// Utilitaires pour la gestion de l'authentification

export function cleanupLocalStorage() {
  // Nettoyer les anciennes clés d'authentification
  const adminToken = localStorage.getItem('adminToken');
  const authToken = localStorage.getItem('authToken');
  
  // Si on a un adminToken mais pas d'authToken, migrer
  if (adminToken && !authToken) {
    localStorage.setItem('authToken', adminToken);
  }
  
  // Supprimer l'ancienne clé
  localStorage.removeItem('adminToken');
}

export function getAuthToken(): string | null {
  // Nettoyer d'abord
  cleanupLocalStorage();
  
  // Retourner le token actuel
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  // Nettoyer d'abord
  cleanupLocalStorage();
  
  // Définir le nouveau token
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminToken');
}