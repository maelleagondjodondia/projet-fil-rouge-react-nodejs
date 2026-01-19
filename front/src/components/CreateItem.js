import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CreateItem({ onItemCreated }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Vous devez être connecté pour créer un item");
      return;
    }

    try {
      const res = await fetch("/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setDescription("");
        onItemCreated(data);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    }
  };

  return (
    <div>
      <h2>Créer un nouvel item</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
