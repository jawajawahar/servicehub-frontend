"use client";

import { useState } from "react";

import Link from "next/link";

import {
  MapPin,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Clock3,
  MessageCircle,
  Star,
  ArrowUpRight,
} from "lucide-react";

import api from "../services/api";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function JobCard({
  job,
  onDelete,
  onView,
  onApply,
  openChat,
  onReport,
}) {
  const { user } = useAuth();

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
      bg-slate-100
      text-slate-700
      border
      border-slate-200
    `,

    Closed: `
      bg-slate-100
      text-slate-700
      border
      border-slate-200
    `,
  };

  // DELETE JOB
  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = confirm("Delete this job?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${job._id}`);

      toast.success("Job deleted");

      onDelete(job._id);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-[#E2E8F0]
      bg-white
      shadow-[0_6px_30px_rgba(15,23,42,0.05)]
      hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]
      hover:-translate-y-1
      transition-all
      duration-500
      flex
      flex-col
      h-[445px]
      "
    >
      {/* IMAGE */}
      <div
        className="
        relative
        h-[210px]
        overflow-hidden
        "
      >
        {job.images && job.images.length > 0 ? (
          <img
            src={job.images[0]}
            alt={job.title}
            className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
            w-full
            h-full
            bg-gradient-to-br
            from-slate-100
            to-slate-200
            flex
            items-center
            justify-center
            text-5xl
            "
          >
            🛠️
          </div>
        )}

        {/* OVERLAY */}
        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/55
          via-black/10
          to-transparent
          "
        />

        {/* STATUS */}
        <div
          className={`
          absolute
          top-4
          right-4
          px-3
          py-1.5
          rounded-full
          text-[11px]
          font-bold
          backdrop-blur-md
          ${statusColors[job.status]}
          `}
        >
          {job.status}
        </div>

        {/* CATEGORY */}
        <div
          className="
          absolute
          bottom-4
          left-4
          px-3
          py-1.5
          rounded-full
          bg-white/15
          backdrop-blur-md
          border
          border-white/10
          text-white
          text-[11px]
          font-semibold
          "
        >
          {job.category}
        </div>
      </div>

      {/* CONTENT */}
      <div
        className="
        flex-1
        flex
        flex-col
        p-5
        "
      >
        {/* TOP */}
        <div
          className="
          flex
          items-start
          justify-between
          gap-3
          "
        >
          {/* TITLE */}
          <div className="flex-1">
            <h2
              className="
              text-[19px]
              font-[800]
              tracking-tight
              text-[#0F172A]
              leading-tight
              line-clamp-2
              group-hover:text-[#2563EB]
              transition-all
              duration-300
              "
            >
              {job.title}
            </h2>

            <div
              className="
              flex
              items-center
              gap-2
              mt-3
              text-sm
              text-[#64748B]
              "
            >
              <MapPin size={14} />

              <span>{job.location}</span>
            </div>
          </div>

          {/* OWNER ACTIONS */}
          {user &&
            user.role === "homeowner" &&
            user.id === job.createdBy?._id && (
              <div
                className="
                flex
                items-center
                gap-2
                shrink-0
                "
              >
                {/* EDIT */}
                <Link
                  href={`/jobs/edit/${job._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#F8FAFC]
                  hover:bg-blue-50
                  border
                  border-[#E2E8F0]
                  hover:border-blue-100
                  text-[#475569]
                  hover:text-blue-600
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  "
                >
                  <Pencil size={15} />
                </Link>

                {/* DELETE */}
                <button
                  onClick={handleDelete}
                  className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#F8FAFC]
                  hover:bg-red-50
                  border
                  border-[#E2E8F0]
                  hover:border-red-100
                  text-[#475569]
                  hover:text-red-600
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  "
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
        </div>

        {/* DESCRIPTION */}
        <p
          className="
          mt-4
          text-[14px]
          leading-7
          text-[#64748B]
          line-clamp-3
          "
        >
          {job.description}
        </p>

        {/* RATING + DATE */}
        <div
          className="
          flex
          items-center
          justify-between
          mt-5
          "
        >
          {/* RATING */}
          {job.averageRating > 0 ? (
            <div
              className="
              flex
              items-center
              gap-2
              "
            >
              <Star
                size={15}
                className="
                fill-yellow-400
                text-yellow-400
                "
              />

              <span
                className="
                text-sm
                font-semibold
                text-[#334155]
                "
              >
                {job.averageRating}
              </span>

              <span
                className="
                text-sm
                text-[#94A3B8]
                "
              >
                ({job.totalReviews})
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* DATE */}
          <div
            className="
            flex
            items-center
            gap-2
            text-[#94A3B8]
            text-sm
            "
          >
            <Clock3 size={14} />

            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* SCHEDULE */}
        {job.scheduledDate && (
          <div
            className="
            mt-5
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-4
            "
          >
            <div
              className="
              flex
              items-center
              gap-2
              mb-2
              "
            >
              <CalendarDays
                size={15}
                className="
                text-indigo-600
                "
              />

              <p
                className="
                text-[11px]
                font-bold
                uppercase
                tracking-wide
                text-indigo-600
                "
              >
                Scheduled Visit
              </p>
            </div>

            <p
              className="
              text-sm
              font-medium
              text-[#334155]
              "
            >
              {new Date(job.scheduledDate).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex-1" />

        {/* ACTIONS */}
        <div
          className="
          flex
          items-center
          gap-2
          mt-5
          "
        >
          {/* CHAT */}
          {job.status === "In Progress" && (
            <button
              onClick={() => openChat(job._id)}
              className="
              w-11
              h-11
              rounded-2xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              text-white
              flex
              items-center
              justify-center
              shadow-[0_10px_25px_rgba(37,99,235,0.18)]
              transition-all
              duration-300
              "
            >
              <MessageCircle size={17} />
            </button>
          )}

          {/* APPLY */}
          {user && user.role === "tradesperson" && job.status === "Open" && (
            <button
              onClick={() => onApply(job)}
              className="
                h-11
                px-5
                rounded-2xl
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                text-sm
                font-semibold
                shadow-[0_10px_25px_rgba(5,150,105,0.18)]
                transition-all
                duration-300
                "
            >
              Apply
            </button>
          )}

          {/* REPORT */}
          <button
            onClick={() => onReport(job)}
            className="
            w-11
            h-11
            rounded-2xl
            bg-[#F8FAFC]
            hover:bg-red-50
            border
            border-[#E2E8F0]
            hover:border-red-100
            text-[#475569]
            hover:text-red-600
            flex
            items-center
            justify-center
            transition-all
            duration-300
            "
          >
            🚩
          </button>

          {/* DETAILS */}
          <button
            onClick={() => onView(job)}
            className="
            flex-1
            h-11
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
            <Eye size={16} />
            Details
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
