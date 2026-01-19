// src/pages/ItemsPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

interface Item {
  _id: string;
  title: string;
  description: string;
  photo?: string;
  favorites?: string[];
}

const ItemsPage: React.FC = () => {
  const { token } = useAuth(); // Hook personnalisé pour récupérer le token
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Récupérer les items depuis le backend
  const fetchItems = async () => {
    try {
      const res = await axios.get<Item[]>("http://localhost:4000/items");
      setItems(res.data);
    } catch (err) {
      console.error("Erreur fetchItems:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Ajouter un item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (photoFile) formData.append("photo", photoFile);

    try {
      await axios.post("http://localhost:4000/items", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setDescription("");
      setPhotoFile(null);
      fetchItems();
    } catch (err) {
      console.error("Erreur handleAddItem:", err);
    }
  };

  // Ajouter / retirer des favoris (local)
  const handleFavorite = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? {
              ...item,
              favorites: item.favorites?.includes("local")
                ? item.favorites.filter((f) => f !== "local")
                : [...(item.favorites || []), "local"],
            }
          : item
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Formulaire création item */}
      <h1 className="text-2xl font-bold mb-4">Créer un nouvel item</h1>
      <form
        onSubmit={handleAddItem}
        className="mb-8 bg-white p-4 rounded shadow space-y-2"
      >
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhotoFile(e.target.files ? e.target.files[0] : null)
          }
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Créer
        </button>
      </form>

      {/* Liste des items */}
      <h2 className="text-xl font-bold mb-4">Liste des items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            photo={item.photo}
            isFavorite={item.favorites?.includes("local") || false}
            onFavorite={() => handleFavorite(item._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
