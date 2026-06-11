import { MdClose } from "react-icons/md";

export const ImagePreview = ({src, alt = "", onClose,}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl transition cursor-pointer"
        >
          <MdClose size={26} />
        </button>

        <div
          className="bg-black/50 border-2 border-white rounded-xl shadow-2xl overflow-hidden"
        >
          <img
            src={src}
            alt={alt}
            className="object-contain max-w-[95vw] max-h-[90vh]"
          />
        </div>
      </div>
    </div>
  );
};