export default function DragDropUpload({ onUpload }) {
  const drop = (e) => {
    e.preventDefault();
    const url = e.dataTransfer.getData("text");
    if (url) onUpload(url);
  };

  return (
    <div
      onDrop={drop}
      onDragOver={(e) => e.preventDefault()}
      className="drag-drop border-2 border-dashed border-cyan-400 rounded-xl p-6 mb-8 text-center text-cyan-400"
    >
      Drag & drop image URL here
    </div>
  );
}
