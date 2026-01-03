export default function ImageModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="max-w-4xl p-4">
        <img
          src={image.imageUrl}
          className="rounded-xl max-h-[80vh] mx-auto"
        />
        <button
          onClick={onClose}
          className="upload-btn w-full mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}
