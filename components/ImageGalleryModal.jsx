"use client";

import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight, X, Images, Expand } from "lucide-react";

export default function ImageGalleryModal({
  open,
  onClose,
  images,
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!open) return null;

  // ===================================
  // NEXT
  // ===================================
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ===================================
  // PREVIOUS
  // ===================================
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      className="
      fixed
      inset-0
      z-[200]
      bg-black/80
      backdrop-blur-xl
      flex
      items-center
      justify-center
      p-4
      "
    >
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0" />

      {/* MAIN CONTAINER */}
      <div
        className="
        relative
        w-full
        max-w-7xl
        h-[92vh]
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        shadow-[0_25px_120px_rgba(0,0,0,0.45)]
        overflow-hidden
        flex
        flex-col
        "
      >
        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}
        <div
          className="
          h-[78px]
          px-6
          border-b
          border-white/10
          bg-black/10
          flex
          items-center
          justify-between
          shrink-0
          "
        >
          {/* LEFT */}
          <div
            className="
            flex
            items-center
            gap-4
            "
          >
            {/* ICON */}
            <div
              className="
              w-12
              h-12
              rounded-2xl
              bg-white/10
              border
              border-white/10
              text-white
              flex
              items-center
              justify-center
              "
            >
              <Images size={22} />
            </div>

            {/* TEXT */}
            <div>
              <h2
                className="
                text-[20px]
                font-[800]
                tracking-tight
                text-white
                "
              >
                Image Gallery
              </h2>

              <p
                className="
                text-sm
                text-white/60
                mt-1
                "
              >
                View uploaded project images
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            {/* COUNTER */}
            <div
              className="
              px-4
              py-2
              rounded-2xl
              bg-white/10
              border
              border-white/10
              text-white
              text-sm
              font-semibold
              "
            >
              {currentIndex + 1} / {images.length}
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
              w-11
              h-11
              rounded-2xl
              bg-white/10
              hover:bg-red-500/20
              border
              border-white/10
              hover:border-red-500/20
              text-white
              hover:text-red-300
              flex
              items-center
              justify-center
              transition-all
              duration-300
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =================================== */}
        {/* IMAGE AREA */}
        {/* =================================== */}
        <div
          className="
          relative
          flex-1
          flex
          items-center
          justify-center
          overflow-hidden
          px-8
          py-6
          "
        >
          {/* PREVIOUS */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="
              absolute
              left-6
              z-20
              w-12
              h-12
              rounded-2xl
              bg-white/10
              hover:bg-white/20
              border
              border-white/10
              text-white
              flex
              items-center
              justify-center
              backdrop-blur-xl
              transition-all
              duration-300
              "
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* IMAGE CARD */}
          <div
            className="
            relative
            group
            max-w-full
            max-h-full
            "
          >
            {/* GLOW */}
            <div
              className="
              absolute
              inset-0
              bg-blue-500/10
              blur-3xl
              scale-110
              rounded-full
              opacity-50
              "
            />

            {/* IMAGE */}
            <img
              src={images[currentIndex]}
              alt="gallery"
              className="
              relative
              max-h-[68vh]
              max-w-full
              object-contain
              rounded-[28px]
              border
              border-white/10
              shadow-[0_20px_80px_rgba(0,0,0,0.45)]
              "
            />

            {/* EXPAND BADGE */}
            <div
              className="
              absolute
              bottom-4
              right-4
              px-4
              py-2
              rounded-2xl
              bg-black/40
              backdrop-blur-xl
              border
              border-white/10
              text-white
              text-sm
              font-medium
              flex
              items-center
              gap-2
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-300
              "
            >
              <Expand size={15} />
              Preview
            </div>
          </div>

          {/* NEXT */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="
              absolute
              right-6
              z-20
              w-12
              h-12
              rounded-2xl
              bg-white/10
              hover:bg-white/20
              border
              border-white/10
              text-white
              flex
              items-center
              justify-center
              backdrop-blur-xl
              transition-all
              duration-300
              "
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* =================================== */}
        {/* THUMBNAILS */}
        {/* =================================== */}
        {images.length > 1 && (
          <div
            className="
            shrink-0
            border-t
            border-white/10
            bg-black/10
            px-6
            py-5
            "
          >
            <div
              className="
              flex
              items-center
              justify-center
              gap-3
              overflow-x-auto
              scrollbar-hide
              "
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative
                    w-[92px]
                    h-[92px]
                    rounded-2xl
                    overflow-hidden
                    border
                    flex-shrink-0
                    transition-all
                    duration-300

                    ${
                      currentIndex === index
                        ? `
                          border-blue-400
                          scale-105
                          shadow-[0_10px_30px_rgba(59,130,246,0.35)]
                        `
                        : `
                          border-white/10
                          opacity-60
                          hover:opacity-100
                        `
                    }
                  `}
                >
                  {/* IMAGE */}
                  <img
                    src={image}
                    alt="thumbnail"
                    className="
                    w-full
                    h-full
                    object-cover
                    "
                  />

                  {/* ACTIVE OVERLAY */}
                  {currentIndex === index && (
                    <div
                      className="
                      absolute
                      inset-0
                      bg-blue-500/10
                      border-2
                      border-blue-400
                      rounded-2xl
                      "
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
