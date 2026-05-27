"use client";

import { useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import {
  Star,
  X,
  ShieldCheck,
  MessageSquareText,
  BadgeCheck,
} from "lucide-react";

export default function ReviewModal({ open, onClose, jobId }) {
  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  // ===================================
  // SUBMIT REVIEW
  // ===================================
  const submitReview = async () => {
    try {
      setLoading(true);

      await api.post(`/reviews/${jobId}`, {
        rating,
        comment,
      });

      toast.success("Review submitted");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Review failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="
      fixed
      inset-0
      z-[999]
      bg-[#020617]/70
      backdrop-blur-xl
      flex
      items-center
      justify-center
      p-4
      "
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
        relative
        overflow-hidden
        w-full
        max-w-xl
        rounded-[36px]
        border
        border-[#E2E8F0]
        bg-white
        shadow-[0_30px_90px_rgba(15,23,42,0.20)]
        "
      >
        {/* GLOW */}
        <div
          className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-yellow-100/40
          blur-3xl
          rounded-full
          pointer-events-none
          "
        />

        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}

        <div
          className="
          relative
          px-8
          py-7
          border-b
          border-[#EEF2F7]
          "
        >
          <div
            className="
            flex
            items-start
            justify-between
            gap-5
            "
          >
            {/* LEFT */}
            <div
              className="
              flex
              items-start
              gap-5
              "
            >
              {/* ICON */}
              <div
                className="
                w-16
                h-16
                rounded-[24px]
                bg-[#0F172A]
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                shrink-0
                "
              >
                <Star size={28} />
              </div>

              {/* TEXT */}
              <div>
                {/* BADGE */}
                <div
                  className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1
                  rounded-full
                  bg-[#FEF3C7]
                  border
                  border-[#FDE68A]
                  text-[#B45309]
                  text-xs
                  font-semibold
                  mb-4
                  "
                >
                  <BadgeCheck size={12} />
                  Customer Feedback
                </div>

                {/* TITLE */}
                <h2
                  className="
                  text-[32px]
                  leading-none
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Rate Tradesperson
                </h2>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-3
                  leading-7
                  max-w-[420px]
                  "
                >
                  Share your experience and help others make informed decisions.
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
              w-11
              h-11
              rounded-2xl
              bg-[#F8FAFC]
              hover:bg-red-50
              border
              border-[#E2E8F0]
              hover:border-red-100
              text-[#64748B]
              hover:text-red-600
              flex
              items-center
              justify-center
              transition-all
              duration-300
              shrink-0
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =================================== */}
        {/* BODY */}
        {/* =================================== */}

        <div
          className="
          relative
          px-8
          py-8
          "
        >
          {/* =================================== */}
          {/* RATING */}
          {/* =================================== */}

          <div className="mb-8">
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-5
              "
            >
              <Star
                size={16}
                className="
                text-amber-500
                "
              />

              <p
                className="
                text-sm
                font-bold
                text-[#0F172A]
                "
              >
                Your Rating
              </p>
            </div>

            {/* STAR BOX */}
            <div
              className="
              rounded-[30px]
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              p-6
              "
            >
              {/* STARS */}
              <div
                className="
                flex
                items-center
                justify-center
                gap-4
                "
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="
                      transition-all
                      duration-300
                      hover:scale-110
                      "
                  >
                    <Star
                      size={42}
                      className={`
                        transition-all
                        duration-300

                        ${
                          star <= rating
                            ? `
                              fill-[#FACC15]
                              text-[#FACC15]
                              drop-shadow-sm
                              `
                            : `
                              text-[#CBD5E1]
                            `
                        }
                        `}
                    />
                  </button>
                ))}
              </div>

              {/* TEXT */}
              <div className="text-center mt-5">
                <p
                  className="
                  text-lg
                  font-bold
                  text-[#0F172A]
                  "
                >
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                      ? "Very Good"
                      : rating === 3
                        ? "Good"
                        : rating === 2
                          ? "Fair"
                          : "Poor"}
                </p>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-2
                  "
                >
                  {rating} out of 5 stars
                </p>
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* COMMENT */}
          {/* =================================== */}

          <div className="mb-8">
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-4
              "
            >
              <MessageSquareText
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <p
                className="
                text-sm
                font-bold
                text-[#0F172A]
                "
              >
                Review Comment
              </p>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience with the tradesperson, quality of work, communication, punctuality, and professionalism..."
              className="
              w-full
              rounded-[28px]
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              px-5
              py-5
              text-sm
              leading-8
              text-[#0F172A]
              placeholder:text-[#94A3B8]
              outline-none
              resize-none
              transition-all
              duration-300
              focus:border-[#2563EB]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>

          {/* =================================== */}
          {/* INFO CARD */}
          {/* =================================== */}

          <div
            className="
            flex
            items-start
            gap-4
            rounded-[28px]
            border
            border-emerald-100
            bg-emerald-50
            p-5
            mb-8
            "
          >
            {/* ICON */}
            <div
              className="
              w-14
              h-14
              rounded-[20px]
              bg-emerald-100
              text-emerald-700
              flex
              items-center
              justify-center
              shrink-0
              "
            >
              <ShieldCheck size={24} />
            </div>

            {/* TEXT */}
            <div>
              <h3
                className="
                text-sm
                font-bold
                text-emerald-900
                mb-2
                "
              >
                Honest Reviews Matter
              </h3>

              <p
                className="
                text-sm
                leading-7
                text-emerald-700
                "
              >
                Your feedback helps maintain quality and trust across the
                platform community.
              </p>
            </div>
          </div>

          {/* =================================== */}
          {/* ACTIONS */}
          {/* =================================== */}

          <div
            className="
            flex
            items-center
            gap-4
            "
          >
            {/* CANCEL */}
            <button
              onClick={onClose}
              className="
              flex-1
              h-14
              rounded-[22px]
              border
              border-[#E2E8F0]
              bg-white
              hover:bg-[#F8FAFC]
              text-[#0F172A]
              text-sm
              font-bold
              transition-all
              duration-300
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}
            <button
              onClick={submitReview}
              disabled={loading}
              className="
              flex-1
              h-14
              rounded-[22px]
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              disabled:opacity-50
              text-white
              text-sm
              font-bold
              shadow-[0_12px_30px_rgba(37,99,235,0.18)]
              transition-all
              duration-300
              "
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
