import React from "react";

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  photo?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  photo,
  onFavorite,
  isFavorite = false,
}) => {
  return (
    <div
      id={id}
      className="border rounded p-4 shadow hover:shadow-lg transition flex flex-col items-center"
    >
      {photo && (
        <img
          src={photo}
          alt={title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-700 text-center">{description}</p>
      {onFavorite && (
        <button
          onClick={onFavorite}
          className={`mt-2 px-2 py-1 rounded ${
            isFavorite ? "bg-yellow-400" : "bg-gray-300"
          }`}
        >
          {isFavorite ? "★ Favori" : "☆ Ajouter aux favoris"}
        </button>
      )}
    </div>
  );
};

export default ItemCard;
