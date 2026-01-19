import Item from "../models/Item.js";


export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "username");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "username");
    if (!item) return res.status(404).json({ error: "Item non trouvé" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({ title, description, owner: req.user.id, photo });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item non trouvé" });
  if (item.owner.toString() !== req.userId) return res.status(403).json({ error: "Action interdite" });

  const { title, description } = req.body;
  item.title = title || item.title;
  item.description = description || item.description;
  await item.save();
  res.json(item);
};

export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item non trouvé" });
  if (item.owner.toString() !== req.userId) return res.status(403).json({ error: "Action interdite" });

  await item.remove();
  res.json({ message: "Item supprimé" });
};

export const toggleFavorite = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item non trouvé" });

  const userId = req.userId;
  const index = item.favorites.indexOf(userId);

  if (index === -1) {
    item.favorites.push(userId); // ajoute aux favoris
  } else {
    item.favorites.splice(index, 1); // retire des favoris
  }

  await item.save();
  res.json(item);
};

