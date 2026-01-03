import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";
import toast from "react-hot-toast";

export default function PublicProfile() {
  const { username } = useParams(); 
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPublicImages = async () => {
    try {
      const res = await api.get(`/images/public/${username}`);
      setImages(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadPublicImages();
    }
  }, [username]);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2 className="section-title text-center mb-6">
          @{username}'s Gallery
        </h2>

        {loading && (
          <p className="text-gray-400 text-center">
            Loading images...
          </p>
        )}

        {!loading && images.length === 0 && (
          <p className="text-gray-400 text-center">
            No public images available.
          </p>
        )}

        <div className="masonry">
          {images.map((img) => (
            <ImageCard
              key={img._id}
              image={img}
              hideActions
            />
          ))}
        </div>

      </div>
    </>
  );
}
