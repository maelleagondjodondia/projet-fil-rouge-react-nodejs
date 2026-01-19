import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SettingsPage() {
  const { token, logout } = useContext(AuthContext);

  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "darkMode",
      document.documentElement.classList.contains("dark")
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Paramètres
        </h1>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-700 dark:text-gray-300 font-semibold">
            Mode sombre
          </span>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Activer / Désactiver
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-col space-y-3">
          {!token ? (
            <a
              href="/login"
              className="w-full text-center py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Se connecter
            </a>
          ) : (
            <button
              onClick={logout}
              className="w-full py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
