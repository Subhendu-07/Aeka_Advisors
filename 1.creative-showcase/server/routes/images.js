import express from "express";
import Image from "../models/Image.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   🔥 PUBLIC: Homepage images
========================= */
router.get("/public", async (req, res) => {
  try {
    const images = await Image.find()
      .populate("user", "username")
      .sort({ _id: -1 });

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to load images" });
  }
});

/* =========================
   PUBLIC: User profile
========================= */
router.get("/public/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.json([]);

  const images = await Image.find({ user: user._id }).sort({ _id: -1 });
  res.json(images);
});

/* =========================
   PRIVATE: Upload image
========================= */
router.post("/", auth, async (req, res) => {
  const img = await Image.create({
    imageUrl: req.body.imageUrl,
    user: req.user.id,
  });
  res.json(img);
});

/* =========================
   PRIVATE: Dashboard images
========================= */
router.get("/:username", auth, async (req, res) => {
  const images = await Image.find({ user: req.user.id }).sort({ _id: -1 });
  res.json(images);
});

/* =========================
   PRIVATE: Delete image
========================= */
router.delete("/:id", auth, async (req, res) => {
  const img = await Image.findById(req.params.id);
  if (!img) return res.status(404).json({ msg: "Not found" });

  if (img.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  await img.deleteOne();
  res.json({ msg: "Deleted" });
});

/* =========================
   PRIVATE: Like / Unlike
========================= */
router.put("/like/:id", auth, async (req, res) => {
  const img = await Image.findById(req.params.id);
  if (!img) return res.status(404).json({ msg: "Not found" });

  const userId = req.user.id;

  if (img.likes.includes(userId)) {
    img.likes.pull(userId);
  } else {
    img.likes.push(userId);
  }

  await img.save();
  res.json(img);
});

export default router;
