import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link
          to="/"
          className="text-gray-800 dark:text-gray-100 font-semibold hover:text-purple-500 dark:hover:text-purple-400 transition"
        >
          Accueil
        </Link>
        <Link
          to="/search"
          className="text-gray-800 dark:text-gray-100 font-semibold hover:text-purple-500 dark:hover:text-purple-400 transition"
        >
          Recherche
        </Link>
        <Link
          to="/settings"
          className="text-gray-800 dark:text-gray-100 font-semibold hover:text-purple-500 dark:hover:text-purple-400 transition"
        >
          Paramètres
        </Link>
      </div>

      <div>
        {token ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md transition"
          >
            Déconnexion
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-md transition"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
