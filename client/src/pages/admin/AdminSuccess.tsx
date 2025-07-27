import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSuccess() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    // ─── 1. Récupération du token ───────────────────────────────────────────
    const token = localStorage.getItem("authToken");

    if (!token) {
      setVerificationError("Token manquant");
      setIsVerifying(false);
      setTimeout(() => (window.location.href = "/admin/login"), 2000);
      return;
    }

    // ─── 2. Vérification du token auprès du backend ─────────────────────────

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {

        if (!response.ok) {
          throw new Error(`Token invalide (status: ${response.status})`);
        }

        // ─── 3. Token valide : uniformiser le stockage ──────────────────

        /*
         * On duplique le jeton sous plusieurs clés pour satisfaire
         * tous les gardes de routes (dashboard) et le hook useAuthState.
         */
        localStorage.setItem("authToken", token); // déjà la clé « publique »
        localStorage.setItem("finalToken", token); // ✅ AJOUT
        // (si vous gardez encore adminToken ailleurs, libre à vous de l’écrire aussi)

        // ─── 4. Redirection « propre » ──────────────────────────────────
        setTimeout(() => {
          window.location.replace("/admin/dashboard");
        }, 500);
      })
      .catch((error) => {
        console.error("Erreur de vérification:", error);
        setVerificationError(`Erreur de vérification: ${error.message}`);
        localStorage.removeItem("authToken");
        localStorage.removeItem("finalToken"); // nettoyage
        setTimeout(() => (window.location.href = "/admin/login"), 2000);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // UI en cas d’erreur
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

  // ──────────────────────────────────────────────────────────────────────────
  // UI de transition pendant la vérification
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
          {isVerifying
            ? "Vérification en cours..."
            : "Redirection automatique vers le dashboard..."}
        </p>

        {!isVerifying && (
          <div className="mt-6">
            <button
              onClick={() => {
                window.location.href = `${window.location.origin}/admin/dashboard`;
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
