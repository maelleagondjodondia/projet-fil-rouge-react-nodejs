import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur réseau");
        setLoading(false);
      });
  }, [id]);

  const toggleFavorite = () => {
    if (!item) return;
    let updated;
    if (favorites.includes(item._id)) {
      updated = favorites.filter((fid) => fid !== item._id);
    } else {
      updated = [...favorites, item._id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet item ?")) return;
    try {
      const res = await fetch(`http://localhost:4000/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch {
      alert("Erreur réseau");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300 mt-10">
        Chargement...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );

  if (!item)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300 mt-10">
        Item non trouvé
      </p>
    );

  const isOwner = userId === item.owner?._id;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <img
          src={item.photo || "https://via.placeholder.com/600x400"}
          alt={item.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            {item.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Par : {item.owner?.username || "Utilisateur inconnu"}
          </p>

          <div className="flex gap-4">
            <button
              onClick={toggleFavorite}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                favorites.includes(item._id)
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {favorites.includes(item._id) ? "★ Favori" : "☆ Favori"}
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => alert("Edit à implémenter")}
                  className="px-4 py-2 rounded-md font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md font-semibold bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
