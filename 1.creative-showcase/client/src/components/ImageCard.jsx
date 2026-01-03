import { FaHeart, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageCard({
  image,
  onDelete,
  onLike,
  onPreview,
  hideActions = false,
}) {
  const userId = localStorage.getItem("userId");
  const isLiked = image.likes?.includes(userId);
  const likeCount = image.likes?.length || 0;

  return (
    <div className="image-card group relative">
      <img
        src={image.imageUrl}
        alt="creative"
        loading="lazy"
        onClick={() => onPreview?.(image)}
        className="cursor-pointer w-full rounded-xl"
      />

      {!hideActions && (
        <div className="absolute inset-0 bg-black/55 opacity-0
     group-hover:opacity-100 transition-opacity duration-300
     flex items-end justify-between p-3">

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

          <button onClick={() => onDelete(image._id)}>
            <FaTrash className="text-white text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
