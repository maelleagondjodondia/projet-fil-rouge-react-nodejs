import React, { useState } from "react";

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Paramètres</h2>
      <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        {darkMode ? "Désactiver Dark Mode" : "Activer Dark Mode"}
      </button>
    </div>
  );
};

export default SettingsPage;
