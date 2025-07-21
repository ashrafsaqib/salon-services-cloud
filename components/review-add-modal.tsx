import React, { useState } from 'react';

interface ReviewAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  staff_id?: number | null;
  service_id?: number | null;
  order_id?: number | null;
}

const ReviewAddModal: React.FC<ReviewAddModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  staff_id = null,
  service_id = null,
  order_id = null,
}) => {
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const addImages = (files: FileList | File[]) => {
    setImages((prev) => {
      const existingNames = prev.map((img) => img.name);
      const newFiles = Array.from(files).filter(
        (file) => !existingNames.includes(file.name)
      );
      return [...prev, ...newFiles];
    });
  };

  const removeImage = (name: string) => {
    setImages((prev) => prev.filter((img) => img.name !== name));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
    }
  };

  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('content', content);
    formData.append('rating', rating.toString());
    if (staff_id !== null) formData.append('staff_id', staff_id.toString());
    if (service_id !== null) formData.append('service_id', service_id.toString());
    if (order_id !== null) formData.append('order_id', order_id.toString());
    images.forEach((img) => {
      formData.append('images', img);
    });
    if (video) {
      formData.append('video', video);
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Content</label>
            <textarea
              className="w-full border rounded px-2 py-1 min-h-[100px]"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={5}
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={(hoverRating ?? rating) >= star ? '#fbbf24' : '#e5e7eb'}
                    className="w-7 h-7 transition-colors"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
            </div>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Images (optional)</label>
            <div
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() =>
                document.getElementById("review-image-upload-input")?.click()
              }
            >
              <input
                id="review-image-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-500 text-sm">
                Drag & drop or click to select images
              </span>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {images.map((file) => (
                  <div key={file.name} className="relative w-16 h-16">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(file.name)}
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-2">
            <label className="block mb-1">Video (optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideo(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewAddModal;
