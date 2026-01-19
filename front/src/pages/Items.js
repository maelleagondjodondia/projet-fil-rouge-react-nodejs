import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CreateItemPage() {
  const { token, user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  // Fetch items existants
  useEffect(() => {
    fetch("http://localhost:4000/items") // URL absolue pour éviter le proxy
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Vous devez être connecté !");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (file) formData.append("photo", file);

      const res = await fetch("http://localhost:4000/items", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setItems([data, ...items]); // Ajout en haut de la liste
        setTitle("");
        setDescription("");
        setFile(null);
      } else {
        alert(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (item) => {
    if (!token) return alert("Connectez-vous pour mettre en favori !");
    try {
      const res = await fetch(`http://localhost:4000/items/${item._id}/favorite`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setItems(items.map((i) => (i._id === data._id ? data : i)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Formulaire création */}
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-6 mb-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Créer un nouvel item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Photo (depuis votre appareil)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 text-white font-bold py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer l’item"}
          </button>
        </form>
      </div>

      {/* Liste des items existants */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Items existants
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isOwner = token && item.owner?._id === user.userId;
          const isFavorite = token && item.favorites?.includes(user.userId);

          return (
            <div
              key={item._id}
              className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-xl shadow-lg p-4 cursor-pointer hover:scale-105 transform transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.photo || "https://via.placeholder.com/300x200"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                {isFavorite && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white font-bold px-2 py-1 rounded-full shadow-md">
                    ★
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-semibold mt-4 text-gray-800">{item.title}</h2>
              <p className="text-gray-700 mt-1 line-clamp-3">{item.description}</p>

              {token && (
                <button
                  onClick={() => handleToggleFavorite(item)}
                  className={`mt-3 w-full py-2 rounded-md font-semibold transition ${
                    isFavorite
                      ? "bg-yellow-400 text-white hover:bg-yellow-500"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {isFavorite ? "Retirer favoris" : "Ajouter aux favoris"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
