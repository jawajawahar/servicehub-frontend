"use client";

import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  Star,
  X,
  MapPin,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { useState } from "react";

import PaymentModal from "./PaymentModal";

export default function JobDetailsModal({ open, onClose, job }) {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [comment, setComment] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);

  if (!open || !job) return null;

  // COMPLETE JOB
  const handleCompleteJob = async () => {
    try {
      await api.patch(`/jobs/complete/${job._id}`);

      toast.success("Job completed successfully");

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to complete job");
    }
  };

  // SUBMIT REVIEW
  const handleSubmitReview = async () => {
    try {
      setReviewLoading(true);

      await api.post(`/reviews/${job._id}`, {
        rating,
        comment,
      });

      toast.success("Review submitted");

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  // START JOB
  const handleStartJob = async () => {
    try {
      await api.patch(`/jobs/${job._id}`, {
        status: "In Progress",
      });

      toast.success("Job started");

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // STATUS COLORS
  const statusColors = {
    Open: `
      bg-emerald-50
      text-emerald-700
      border
      border-emerald-100
    `,

    "In Progress": `
      bg-amber-50
      text-amber-700
      border
      border-amber-100
    `,

    Completed: `
      bg-blue-50
      text-blue-700
      border
      border-blue-100
    `,

    Closed: `
      bg-slate-100
      text-slate-700
      border
      border-slate-200
    `,
  };

  return (
    <div
      className="
      fixed
      inset-0
      z-[200]
      bg-black/50
      backdrop-blur-md
      flex
      items-center
      justify-center
      p-4
      "
    >
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0" />

      {/* MODAL */}
      <div
        className="
        relative
        w-full
        max-w-4xl
        h-[85vh]
        overflow-hidden
        rounded-[28px]
        border
        border-white/40
        bg-white/80
        backdrop-blur-2xl
        shadow-[0_25px_80px_rgba(15,23,42,0.18)]
        flex
        flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
          shrink-0
          px-6
          py-5
          border-b
          border-slate-200/70
          bg-white/70
          backdrop-blur-xl
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* TAGS */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <div
                  className="
                  px-3
                  py-1
                  rounded-full
                  bg-blue-50
                  border
                  border-blue-100
                  text-blue-700
                  text-xs
                  font-medium
                  "
                >
                  {job.category}
                </div>

                <div
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${statusColors[job.status]}
                  `}
                >
                  {job.status}
                </div>
              </div>

              {/* TITLE */}
              <h2
                className="
                text-2xl
                md:text-3xl
                font-semibold
                tracking-tight
                text-slate-900
                "
              >
                {job.title}
              </h2>

              {/* INFO */}
              <div
                className="
                flex
                flex-wrap
                items-center
                gap-4
                mt-3
                text-sm
                text-slate-500
                "
              >
                <div className="flex items-center gap-2">
                  <MapPin size={15} />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={15} />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
              w-10
              h-10
              rounded-xl
              border
              border-slate-200
              bg-white
              hover:bg-red-50
              hover:text-red-600
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

        {/* BODY */}
        <div
          className="
          flex-1
          overflow-y-auto
          p-6
          "
        >
          {/* HERO IMAGE */}
          {job.images && job.images.length > 0 && (
            <div
              className="
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-slate-200
              bg-white
              shadow-sm
              mb-6
              "
            >
              <img
                src={job.images[0]}
                alt="job"
                className="
                w-full
                h-[260px]
                object-cover
                "
              />
            </div>
          )}

          {/* CONTENT */}
          <div
            className="
            grid
            grid-cols-1
            lg:grid-cols-[1.7fr_0.9fr]
            gap-5
            "
          >
            {/* LEFT */}
            <div className="space-y-5">
              {/* DESCRIPTION */}
              <div
                className="
                rounded-[22px]
                border
                border-slate-200/70
                bg-white/90
                backdrop-blur-xl
                p-5
                shadow-sm
                "
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Description
                    </h3>

                    <p className="text-sm text-slate-500">
                      Job details and requirements
                    </p>
                  </div>
                </div>

                <p
                  className="
                  text-[15px]
                  leading-7
                  text-slate-600
                  "
                >
                  {job.description}
                </p>
              </div>

              {/* REVIEW */}
              {user &&
                user.role === "homeowner" &&
                job.status === "Completed" && (
                  <div
                    className="
                    rounded-[22px]
                    border
                    border-slate-200/70
                    bg-white/90
                    p-5
                    shadow-sm
                    "
                  >
                    <h3 className="text-lg font-semibold text-slate-900 mb-5">
                      Leave Review
                    </h3>

                    {/* STARS */}
                    <div className="flex items-center gap-2 mb-5">
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
                            size={24}
                            className={
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    {/* COMMENT */}
                    <textarea
                      rows={4}
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      outline-none
                      resize-none
                      text-sm
                      leading-7
                      text-slate-700
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                      "
                    />

                    {/* SUBMIT */}
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="
                      mt-4
                      w-full
                      h-10
                      rounded-xl
                      bg-slate-900
                      hover:bg-black
                      text-white
                      text-sm
                      font-medium
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      "
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}

                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                )}
            </div>

            {/* RIGHT */}
            <div className="space-y-5 lg:sticky lg:top-0 self-start">
              {/* SCHEDULE */}
              {job.scheduledDate && (
                <div
                  className="
                  rounded-[22px]
                  border
                  border-indigo-100
                  bg-gradient-to-br
                  from-indigo-50
                  to-blue-50
                  p-5
                  "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="
                      w-10
                      h-10
                      rounded-xl
                      bg-white
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                      shadow-sm
                      "
                    >
                      <CalendarDays size={17} />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Scheduled Visit
                      </h3>

                      <p className="text-sm text-indigo-500">
                        Appointment date
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-700 leading-7">
                    {new Date(job.scheduledDate).toLocaleString()}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="
                rounded-[22px]
                border
                border-slate-200/70
                bg-white/90
                p-5
                shadow-sm
                space-y-3
                "
              >
                <h3 className="text-base font-semibold text-slate-900">
                  Job Actions
                </h3>

                {/* START */}
                {user &&
                  user.role === "tradesperson" &&
                  job.status === "Open" && (
                    <button
                      onClick={handleStartJob}
                      className="
                      w-full
                      h-10
                      rounded-xl
                      bg-amber-500
                      hover:bg-amber-600
                      text-white
                      text-sm
                      font-medium
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      "
                    >
                      Start Job
                    </button>
                  )}

                {/* COMPLETE */}
                {user &&
                  user.role === "homeowner" &&
                  job.status === "In Progress" && (
                    <button
                      onClick={handleCompleteJob}
                      className="
                      w-full
                      h-10
                      rounded-xl
                      bg-emerald-600
                      hover:bg-emerald-700
                      text-white
                      text-sm
                      font-medium
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      "
                    >
                      <CheckCircle2 size={15} />
                      Complete Service
                    </button>
                  )}

                {/* PAYMENT */}
                {user &&
                  user.role === "homeowner" &&
                  job.status === "In Progress" && (
                    <button
                      onClick={() => setPaymentOpen(true)}
                      className="
                      w-full
                      h-10
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      text-sm
                      font-medium
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      "
                    >
                      Proceed Payment
                    </button>
                  )}

                {/* COMPLETED */}
                {job.status === "Completed" && (
                  <div
                    className="
                    w-full
                    h-10
                    rounded-xl
                    bg-blue-50
                    border
                    border-blue-100
                    text-blue-700
                    text-sm
                    font-medium
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                  >
                    <CheckCircle2 size={15} />
                    Service Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT MODAL */}
        <PaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          job={job}
        />
      </div>
    </div>
  );
}
