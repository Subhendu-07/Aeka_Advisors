import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Navbar from "../components/Navbar";
import ImageCard from "../components/ImageCard";

export default function Landing() {
  const [images, setImages] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    //  Logged out → no images
    if (!token) {
      setImages([]);
      return;
    }

    //  Logged in → load public images
    const loadImages = async () => {
      try {
        const res = await api.get("/images/public");
        setImages(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadImages();
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="section-title text-center">
          Creative Showcase
        </h1>


        {!token && (
          <p className="text-center text-gray-500">
            Please login or signup to explore creative works ✨
          </p>
        )}

        {token && (
          <div className="masonry">
            {images.map((img) => (
              <ImageCard
                key={img._id}
                image={img}
                hideActions
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
