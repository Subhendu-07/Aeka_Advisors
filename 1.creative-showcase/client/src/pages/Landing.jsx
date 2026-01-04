import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";

export default function Landing() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadImages = async () => {
      try {
        const res = await api.get("/images/public");
        setImages(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* Title */}
        <h1 className="section-title text-center">
          Creative Showcase
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-400 mb-8">
          Explore creative works shared by the community ✨
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading images...
          </p>
        )}

        {/* Empty */}
        {!loading && images.length === 0 && (
          <p className="text-center text-gray-500">
            No images available.
          </p>
        )}

        {/* Gallery (always visible) */}
        {!loading && images.length > 0 && (
          <div className="masonry" key={images.length}>
            {images.map((img) => (
              <ImageCard
                key={img._id}
                image={img}
                hideActions={!token} // 🔒 logged out = view only
                
              />
            ))}
          </div>
        )}

        {/* Login hint */}
        {!token && images.length > 0 && (
          <p className="text-center text-gray-500 mt-10 text-sm">
            Login or signup to like, upload, or manage your images ✨
          </p>
        )}
      </div>
    </>
  );
}
