export default function Loading() {
  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-6
      "
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-[#E2E8F0]
          bg-white
          shadow-[0_6px_30px_rgba(15,23,42,0.05)]
          animate-pulse
          "
        >
          {/* IMAGE SKELETON */}
          <div
            className="
            h-[210px]
            bg-gradient-to-br
            from-[#F1F5F9]
            via-[#E2E8F0]
            to-[#F8FAFC]
            "
          />

          {/* CONTENT */}
          <div className="p-5">
            {/* TAGS */}
            <div
              className="
              flex
              items-center
              justify-between
              mb-5
              "
            >
              <div
                className="
                h-7
                w-24
                rounded-full
                bg-[#E2E8F0]
                "
              />

              <div
                className="
                h-7
                w-20
                rounded-full
                bg-[#E2E8F0]
                "
              />
            </div>

            {/* TITLE */}
            <div className="space-y-3 mb-5">
              <div
                className="
                h-5
                rounded-xl
                bg-[#E2E8F0]
                w-[85%]
                "
              />

              <div
                className="
                h-5
                rounded-xl
                bg-[#E2E8F0]
                w-[60%]
                "
              />
            </div>

            {/* LOCATION */}
            <div
              className="
              h-4
              rounded-lg
              bg-[#E2E8F0]
              w-[45%]
              mb-6
              "
            />

            {/* DESCRIPTION */}
            <div className="space-y-3 mb-7">
              <div
                className="
                h-4
                rounded-lg
                bg-[#E2E8F0]
                "
              />

              <div
                className="
                h-4
                rounded-lg
                bg-[#E2E8F0]
                w-[90%]
                "
              />

              <div
                className="
                h-4
                rounded-lg
                bg-[#E2E8F0]
                w-[70%]
                "
              />
            </div>

            {/* INFO */}
            <div
              className="
              flex
              items-center
              justify-between
              mb-6
              "
            >
              <div
                className="
                h-4
                w-20
                rounded-lg
                bg-[#E2E8F0]
                "
              />

              <div
                className="
                h-4
                w-24
                rounded-lg
                bg-[#E2E8F0]
                "
              />
            </div>

            {/* BUTTONS */}
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <div
                className="
                w-11
                h-11
                rounded-2xl
                bg-[#E2E8F0]
                "
              />

              <div
                className="
                flex-1
                h-11
                rounded-2xl
                bg-[#E2E8F0]
                "
              />
            </div>
          </div>

          {/* SHIMMER EFFECT */}
          <div
            className="
            absolute
            inset-0
            -translate-x-full
            animate-[shimmer_2s_infinite]
            bg-gradient-to-r
            from-transparent
            via-white/40
            to-transparent
            "
          />
        </div>
      ))}
    </div>
  );
}
