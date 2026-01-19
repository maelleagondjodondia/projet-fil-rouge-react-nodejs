import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SearchPage() {
  const { token, userId } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupérer tous les items
  const fetchItems = () => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.reverse());
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur réseau");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Toggle favoris locaux
  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((fid) => fid !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Filtrer les items selon la recherche
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Rechercher un item
        </h2>

        {/* Input de recherche */}
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
        />

        {loading ? (
          <p className="text-center text-gray-700 dark:text-gray-300">Chargement...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">Aucun item trouvé</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition hover:shadow-xl"
              >
                <img
                  src={item.photo || "https://via.placeholder.com/400x300"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Par : {item.owner?.username || "Utilisateur inconnu"}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => toggleFavorite(item._id)}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        favorites.includes(item._id)
                          ? "bg-yellow-400 text-white hover:bg-yellow-500"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {favorites.includes(item._id) ? "★ Favori" : "☆ Favori"}
                    </button>

                    {userId === item.owner?._id && (
                      <button
                        onClick={() => alert("Edit / Delete à implémenter")}
                        className="px-3 py-1 rounded-md font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
