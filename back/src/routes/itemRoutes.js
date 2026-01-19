import express from "express";
import Item from "../models/Item.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js"; // <-- Import unique

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "username");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "username");
    if (!item) return res.status(404).json({ error: "Item non trouvé" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create item (auth + upload photo)
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const newItem = new Item({ title, description, photo, owner: req.user.id });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT edit item (auth + owner only + upload photo)
router.put("/:id", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item non trouvé" });
    if (item.owner.toString() !== req.user.id) return res.status(403).json({ error: "Non autorisé" });

    const { title, description } = req.body;
    item.title = title || item.title;
    item.description = description || item.description;
    if (req.file) {
      item.photo = `/uploads/${req.file.filename}`;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item (auth + owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item non trouvé" });
    if (item.owner.toString() !== req.user.id) return res.status(403).json({ error: "Non autorisé" });

    await Item.deleteOne({ _id: item._id });
    res.json({ message: "Item supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle favorite (auth required)
router.post("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item non trouvé" });

    const userId = req.user.id;
    const index = item.favorites?.indexOf(userId);

    if (index === -1) {
      item.favorites = item.favorites || [];
      item.favorites.push(userId);
    } else {
      item.favorites.splice(index, 1);
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
