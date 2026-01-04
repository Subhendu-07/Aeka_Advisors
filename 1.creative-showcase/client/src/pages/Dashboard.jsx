import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";
import DragDropUpload from "../components/DragDropUpload";
import ImageModal from "../components/ImageModal";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  /* =============================
     Load images
     - Logged in → own images
     - Logged out → public images
  ============================== */
  const loadImages = async () => {
    try {
      setLoadingImages(true);

      const res = token
        ? await api.get(`/images/${username}`)
        : await api.get("/images/public");

      setImages(res.data || []);
    } catch {
      toast.error("Failed to load images");
    } finally {
      setLoadingImages(false);
    }
  };

  /* =============================
     Upload image (login only)
  ============================== */
  const uploadImage = async () => {
    if (!url.trim()) return toast.error("Image URL is required");

    try {
      setUploading(true);
      await api.post("/images", { imageUrl: url });
      toast.success("Image uploaded ✨");
      setUrl("");
      loadImages();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =============================
     Delete image (owner only)
  ============================== */
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await api.delete(`/images/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =============================
     Like / Unlike (login only)
  ============================== */
  const likeImage = async (id) => {
    try {
      const res = await api.put(`/images/like/${id}`);
      setImages((prev) =>
        prev.map((img) => (img._id === id ? res.data : img))
      );
    } catch {
      toast.error("Like failed");
    }
  };

  useEffect(() => {
    loadImages();
  }, [token, username]);

  const totalLikes = images.reduce(
    (sum, i) => sum + (i.likes?.length || 0),
    0
  );

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* ============ UPLOAD (LOGIN ONLY) ============ */}
        {token && (
          <>
            <DragDropUpload onUpload={(droppedUrl) => setUrl(droppedUrl)} />

            <div className="upload-card">
              <h2 className="section-title">Upload your creativity</h2>
              <p className="text-gray-400 mb-5">
                Share your best visual moments
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="upload-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste image URL here..."
                />
                <button
                  onClick={uploadImage}
                  disabled={uploading}
                  className="upload-btn"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ============ GALLERY HEADER ============ */}
        <div className="mb-6 mt-6">
          <h2 className="section-title">
            {token ? "Your Gallery" : "Explore Gallery"}
          </h2>
          <p className="text-gray-400 text-sm">
            {images.length} Images
            {token && ` • ${totalLikes} Likes`}
          </p>
        </div>

        {/* ============ STATES ============ */}
        {loadingImages && (
          <p className="text-gray-400 text-center">Loading images...</p>
        )}

        {!loadingImages && images.length === 0 && (
          <p className="text-gray-400 text-center">
            No images available.
          </p>
        )}

        {/* ============ IMAGES ============ */}
        <div className="masonry" key={images.length}>
          {images.map((img) => (
            <ImageCard
              key={img._id}
              image={img}
              onDelete={deleteImage}
              onLike={likeImage}
              onPreview={setPreview}
            />
          ))}
        </div>

      </div>

      <ImageModal image={preview} onClose={() => setPreview(null)} />
    </>
  );
}
