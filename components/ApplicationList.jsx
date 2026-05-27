"use client";

import { Mail, PoundSterling, MessageSquare, Hammer, Star } from "lucide-react";

export default function ApplicationList({ applications }) {
  // EMPTY STATE
  if (!applications || applications.length === 0) {
    return (
      <div
        className="
        border
        border-dashed
        border-[#CBD5E1]
        bg-[#F8FAFC]
        rounded-[28px]
        p-10
        text-center
        "
      >
        {/* ICON */}
        <div
          className="
          w-16
          h-16
          rounded-3xl
          bg-white
          border
          border-[#E2E8F0]
          flex
          items-center
          justify-center
          mx-auto
          mb-5
          shadow-sm
          "
        >
          <Hammer
            size={28}
            className="
            text-[#94A3B8]
            "
          />
        </div>

        <h3
          className="
          text-[18px]
          font-[700]
          tracking-tight
          text-[#0F172A]
          "
        >
          No Applications Yet
        </h3>

        <p
          className="
          text-sm
          text-[#64748B]
          mt-2
          "
        >
          Tradesperson applications will appear here
        </p>
      </div>
    );
  }

  return (
    <div
      className="
      space-y-5
      "
    >
      {applications.map((app) => (
        <div
          key={app._id}
          className="
          group
          relative
          overflow-hidden
          bg-white
          border
          border-[#E2E8F0]
          rounded-[30px]
          p-6
          shadow-[0_4px_20px_rgba(15,23,42,0.04)]
          hover:-translate-y-1
          hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]
          transition-all
          duration-300
          "
        >
          {/* GLOW */}
          <div
            className="
            absolute
            top-0
            right-0
            w-40
            h-40
            bg-blue-50
            blur-3xl
            rounded-full
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
            "
          />

          {/* TOP */}
          <div
            className="
            relative
            flex
            items-start
            justify-between
            gap-4
            "
          >
            {/* LEFT */}
            <div
              className="
              flex
              items-start
              gap-4
              "
            >
              {/* AVATAR */}
              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                text-lg
                font-bold
                shadow-[0_10px_25px_rgba(37,99,235,0.20)]
                shrink-0
                "
              >
                {app.tradesperson?.name?.charAt(0)?.toUpperCase() || "T"}
              </div>

              {/* USER INFO */}
              <div>
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >
                  <h3
                    className="
                    text-[18px]
                    font-[700]
                    tracking-tight
                    text-[#0F172A]
                    "
                  >
                    {app.tradesperson?.name}
                  </h3>

                  {/* VERIFIED */}
                  <div
                    className="
                    px-2
                    py-1
                    rounded-lg
                    bg-green-50
                    text-green-600
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    "
                  >
                    Verified
                  </div>
                </div>

                {/* EMAIL */}
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  mt-2
                  "
                >
                  <Mail
                    size={14}
                    className="
                    text-[#94A3B8]
                    "
                  />

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    "
                  >
                    {app.tradesperson?.email}
                  </p>
                </div>

                {/* STATS */}
                <div
                  className="
                  flex
                  items-center
                  gap-4
                  mt-4
                  "
                >
                  {/* RATING */}
                  <div
                    className="
                    flex
                    items-center
                    gap-1.5
                    "
                  >
                    <Star
                      size={14}
                      className="
                      text-yellow-500
                      fill-yellow-500
                      "
                    />

                    <span
                      className="
                      text-sm
                      font-medium
                      text-[#475569]
                      "
                    >
                      4.9 Rating
                    </span>
                  </div>

                  {/* EXPERIENCE */}
                  <div
                    className="
                    text-sm
                    text-[#64748B]
                    "
                  >
                    Professional Tradesperson
                  </div>
                </div>
              </div>
            </div>

            {/* PRICE */}
            <div
              className="
              shrink-0
              px-5
              py-3
              rounded-2xl
              bg-[#EFF6FF]
              border
              border-[#DBEAFE]
              "
            >
              <div
                className="
                flex
                items-center
                gap-1
                "
              >
                <PoundSterling
                  size={16}
                  className="
                  text-[#2563EB]
                  "
                />

                <span
                  className="
                  text-[20px]
                  font-[800]
                  tracking-tight
                  text-[#2563EB]
                  "
                >
                  {app.estimatedPrice}
                </span>
              </div>

              <p
                className="
                text-[11px]
                text-[#64748B]
                mt-1
                text-center
                "
              >
                Estimated Cost
              </p>
            </div>
          </div>

          {/* MESSAGE */}
          <div
            className="
            relative
            mt-6
            p-5
            rounded-2xl
            bg-[#F8FAFC]
            border
            border-[#EEF2F7]
            "
          >
            {/* HEADER */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <MessageSquare
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <h4
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Proposal Message
              </h4>
            </div>

            {/* TEXT */}
            <p
              className="
              text-[15px]
              leading-8
              text-[#475569]
              "
            >
              {app.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
