import { FaHeart, FaTrash, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ImageCard({
  image,
  onDelete,
  onLike,
  onPreview,
  hideActions = false,
}) {
  const navigate = useNavigate();

  if (!image || !image.imageUrl) return null;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const isLiked = image.likes?.includes(userId);
  const likeCount = image.likes?.length || 0;

  const isOwner =
    image.user?._id === userId || image.user === userId;


  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div
      className="image-card group relative overflow-hidden rounded-xl"
      style={{ breakInside: "avoid", display: "inline-block", width: "100%" }}
    >


      {/* 👤 USERNAME BADGE */}
      {image.user?.username && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="
            absolute top-2 left-2 z-10
            flex items-center gap-1
            bg-black/60 backdrop-blur
            px-3 py-1 rounded-full
            text-xs font-medium
            text-yellow-400
            border border-yellow-400/30
            shadow-[0_0_10px_rgba(250,204,21,0.45)]
            group-hover:shadow-[0_0_18px_rgba(250,204,21,0.85)]
            transition-all duration-300
          "
        >
          @{image.user.username}
          <FaCheckCircle className="text-yellow-400 text-xs" />
        </motion.div>
      )}


      {/* IMAGE */}
      <img
        src={image.imageUrl}
        alt="creative"
        loading="lazy"
        onClick={() => token && onPreview?.(image)}
        className={`
          w-full rounded-xl transition-all duration-300
          ${!token ? "blur-sm scale-[1.02]" : ""}
        `}
      />

      {/* 🔒 LOGIN REQUIRED OVERLAY */}
      {!token && (
        <div
          onClick={handleLoginRedirect}
          className="absolute inset-0 bg-black/60
                     opacity-0 group-hover:opacity-100
                     transition flex items-center justify-center
                     text-sm text-cyan-300 font-medium
                     backdrop-blur cursor-pointer"
        >
          Login to interact ✨
        </div>
      )}

      {/* ACTIONS (ONLY WHEN LOGGED IN) */}
      {token && !hideActions && (
        <div className="absolute inset-0 bg-black/55 opacity-0
                        group-hover:opacity-100 transition
                        flex items-end justify-between p-3">

          {/* ❤️ LIKE */}
          <motion.button
            onClick={() => onLike(image._id)}
            whileTap={{ scale: 1.4 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: isLiked ? [1, 1.3, 1] : [1, 0.9, 1] }}
              transition={{ duration: 0.25 }}
            >
              <FaHeart
                className={`text-xl ${isLiked ? "text-red-500" : "text-white"
                  }`}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.span
                key={likeCount}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white text-sm font-medium"
              >
                {likeCount}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* 🗑 DELETE (OWNER ONLY) */}
          {isOwner && (
            <button onClick={() => onDelete(image._id)}>
              <FaTrash className="text-white text-lg" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
