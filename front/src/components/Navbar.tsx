import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="font-bold hover:text-yellow-300">Accueil</Link>
        <Link to="/search" className="hover:text-yellow-300">Recherche</Link>
        <Link to="/settings" className="hover:text-yellow-300">Paramètres</Link>
      </div>
      <div>
        {token ? (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
            Se déconnecter
          </button>
        ) : (
          <Link to="/login" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
