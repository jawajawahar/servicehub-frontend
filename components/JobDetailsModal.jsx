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
        max-w-6xl
        h-[92vh]
        overflow-hidden
        rounded-[32px]
        border
        border-[#E2E8F0]
        bg-[#F8FAFC]
        shadow-[0_30px_100px_rgba(15,23,42,0.22)]
        flex
        flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
          shrink-0
          px-7
          py-6
          border-b
          border-[#E2E8F0]
          bg-white/90
          backdrop-blur-xl
          "
        >
          <div
            className="
            flex
            items-start
            justify-between
            gap-6
            "
          >
            {/* LEFT */}
            <div className="flex-1">
              {/* TAGS */}
              <div
                className="
                flex
                items-center
                gap-3
                flex-wrap
                mb-5
                "
              >
                {/* CATEGORY */}
                <div
                  className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-[#EFF6FF]
                  border
                  border-[#DBEAFE]
                  text-[#2563EB]
                  text-sm
                  font-semibold
                  "
                >
                  {job.category}
                </div>

                {/* STATUS */}
                <div
                  className={`
                  px-4
                  py-2
                  rounded-2xl
                  text-sm
                  font-semibold
                  ${statusColors[job.status]}
                  `}
                >
                  {job.status}
                </div>
              </div>

              {/* TITLE */}
              <h2
                className="
                text-[34px]
                leading-tight
                font-[900]
                tracking-tight
                text-[#0F172A]
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
                gap-6
                mt-5
                text-sm
                text-[#64748B]
                "
              >
                {/* LOCATION */}
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >
                  <MapPin size={16} />

                  <span>{job.location}</span>
                </div>

                {/* DATE */}
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >
                  <Clock3 size={16} />

                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
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

        {/* BODY */}
        <div
          className="
          flex-1
          overflow-y-auto
          px-7
          py-7
          "
        >
          {/* IMAGES */}
          {job.images && job.images.length > 0 && (
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
              mb-8
              "
            >
              {job.images.map((image, index) => (
                <div
                  key={index}
                  className="
                  group
                  relative
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-[#E2E8F0]
                  bg-white
                  shadow-sm
                  "
                >
                  <img
                    src={image}
                    alt="job"
                    className="
                    w-full
                    h-[250px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                    "
                  />

                  <div
                    className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/30
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-300
                    "
                  />
                </div>
              ))}
            </div>
          )}

          {/* GRID */}
          <div
            className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
            "
          >
            {/* LEFT CONTENT */}
            <div className="xl:col-span-2 space-y-6">
              {/* DESCRIPTION */}
              <div
                className="
                rounded-[28px]
                border
                border-[#E2E8F0]
                bg-white
                p-6
                shadow-sm
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  mb-5
                  "
                >
                  <div
                    className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-[#EFF6FF]
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <h3
                      className="
                      text-[22px]
                      font-[800]
                      tracking-tight
                      text-[#0F172A]
                      "
                    >
                      Description
                    </h3>

                    <p
                      className="
                      text-sm
                      text-[#64748B]
                      mt-1
                      "
                    >
                      Job details and requirements
                    </p>
                  </div>
                </div>

                <p
                  className="
                  text-[15px]
                  leading-8
                  text-[#475569]
                  "
                >
                  {job.description}
                </p>
              </div>

              {/* REVIEW SECTION */}
              {user &&
                user.role === "homeowner" &&
                job.status === "Completed" && (
                  <div
                    className="
                    rounded-[28px]
                    border
                    border-[#E2E8F0]
                    bg-white
                    p-6
                    shadow-sm
                    "
                  >
                    <h3
                      className="
                      text-[22px]
                      font-[800]
                      tracking-tight
                      text-[#0F172A]
                      mb-6
                      "
                    >
                      Leave Review
                    </h3>

                    {/* STARS */}
                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      mb-6
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
                            size={30}
                            className={
                              star <= rating
                                ? `
                                    fill-yellow-400
                                    text-yellow-400
                                  `
                                : `
                                    text-gray-300
                                  `
                            }
                          />
                        </button>
                      ))}
                    </div>

                    {/* COMMENT */}
                    <textarea
                      rows={5}
                      placeholder="Write your review..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E2E8F0]
                      bg-[#FAFBFC]
                      p-5
                      outline-none
                      resize-none
                      text-sm
                      leading-7
                      text-[#0F172A]
                      placeholder:text-[#94A3B8]
                      transition-all
                      duration-300
                      focus:border-[#2563EB]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                      "
                    />

                    {/* SUBMIT */}
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="
                      mt-5
                      w-full
                      h-12
                      rounded-2xl
                      bg-[#0F172A]
                      hover:bg-[#111827]
                      text-white
                      text-sm
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-2
                      transition-all
                      duration-300
                      "
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}

                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              {/* SCHEDULE */}
              {job.scheduledDate && (
                <div
                  className="
                  rounded-[28px]
                  border
                  border-indigo-100
                  bg-gradient-to-br
                  from-indigo-50
                  to-blue-50
                  p-6
                  "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    mb-5
                    "
                  >
                    <div
                      className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-white
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                      shadow-sm
                      "
                    >
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <h3
                        className="
                        text-lg
                        font-bold
                        text-[#312E81]
                        "
                      >
                        Scheduled Visit
                      </h3>

                      <p
                        className="
                        text-sm
                        text-indigo-500
                        "
                      >
                        Appointment date
                      </p>
                    </div>
                  </div>

                  <p
                    className="
                    text-[17px]
                    font-[700]
                    leading-8
                    text-[#1E293B]
                    "
                  >
                    {new Date(job.scheduledDate).toLocaleString()}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="
                rounded-[28px]
                border
                border-[#E2E8F0]
                bg-white
                p-6
                shadow-sm
                space-y-4
                "
              >
                <h3
                  className="
                  text-lg
                  font-[800]
                  text-[#0F172A]
                  "
                >
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
                      h-12
                      rounded-2xl
                      bg-amber-500
                      hover:bg-amber-600
                      text-white
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
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
                      h-12
                      rounded-2xl
                      bg-emerald-600
                      hover:bg-emerald-700
                      text-white
                      text-sm
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-2
                      transition-all
                      duration-300
                      "
                    >
                      <CheckCircle2 size={17} />
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
                      h-12
                      rounded-2xl
                      bg-[#2563EB]
                      hover:bg-[#1D4ED8]
                      text-white
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
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
                    h-12
                    rounded-2xl
                    bg-blue-50
                    border
                    border-blue-100
                    text-blue-700
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    "
                  >
                    <CheckCircle2 size={16} />
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
