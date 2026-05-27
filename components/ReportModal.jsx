"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  AlertTriangle,
  ShieldAlert,
  BadgeX,
  CircleDollarSign,
  UserX,
  X,
  Shield,
  Flag,
  Check,
} from "lucide-react";

export default function ReportModal({ open, onClose, reportedUser, job }) {
  const [loading, setLoading] = useState(false);

  const [selectedReason, setSelectedReason] = useState("");

  const [description, setDescription] = useState("");

  if (!open) return null;

  // ===================================
  // REASONS
  // ===================================

  const reasons = [
    {
      label: "Fraud",

      icon: AlertTriangle,
    },

    {
      label: "Spam",

      icon: BadgeX,
    },

    {
      label: "Abusive",

      icon: ShieldAlert,
    },

    {
      label: "Payment",

      icon: CircleDollarSign,
    },

    {
      label: "Fake Service",

      icon: UserX,
    },
  ];

  // ===================================
  // SUBMIT
  // ===================================

  const handleSubmit = async () => {
    if (!selectedReason) {
      return toast.error("Select reason");
    }

    try {
      setLoading(true);

      await api.post("/reports", {
        reportedUser,

        job,

        reason: selectedReason,

        description,
      });

      toast.success("Report submitted");

      setSelectedReason("");

      setDescription("");

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="
      fixed
      inset-0
      z-[9999]
      bg-black/40
      backdrop-blur-[3px]
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
        w-full
        max-w-[680px]
        rounded-2xl
        border
        border-[#E2E8F0]
        bg-white
        shadow-[0_20px_50px_rgba(15,23,42,0.10)]
        overflow-hidden
        "
      >
        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}

        <div
          className="
          px-5
          py-4
          border-b
          border-[#EEF2F7]
          "
        >
          <div
            className="
            flex
            items-start
            justify-between
            gap-3
            "
          >
            {/* LEFT */}

            <div
              className="
              flex
              items-start
              gap-3
              "
            >
              {/* ICON */}

              <div
                className="
                w-11
                h-11
                rounded-xl
                bg-red-500
                text-white
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <Flag size={18} />
              </div>

              {/* TEXT */}

              <div>
                {/* BADGE */}

                <div
                  className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-full
                  bg-red-50
                  border
                  border-red-100
                  text-red-600
                  text-[10px]
                  font-semibold
                  mb-2
                  "
                >
                  <Shield size={10} />
                  Safety Report
                </div>

                {/* TITLE */}

                <h2
                  className="
                  text-[20px]
                  font-[800]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Report User
                </h2>

                <p
                  className="
                  text-xs
                  text-[#64748B]
                  mt-1.5
                  leading-5
                  "
                >
                  Submit a complaint for suspicious or inappropriate activity.
                </p>
              </div>
            </div>

            {/* CLOSE */}

            <button
              onClick={onClose}
              className="
              w-9
              h-9
              rounded-xl
              bg-[#F8FAFC]
              hover:bg-red-50
              border
              border-[#E2E8F0]
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
              <X size={15} />
            </button>
          </div>
        </div>

        {/* =================================== */}
        {/* BODY */}
        {/* =================================== */}

        <div
          className="
          px-5
          py-5
          "
        >
          {/* =================================== */}
          {/* REASONS */}
          {/* =================================== */}

          <div className="mb-5">
            {/* LABEL */}

            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <ShieldAlert
                size={14}
                className="
                text-red-500
                "
              />

              <p
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Select Reason
              </p>
            </div>

            {/* GRID */}

            <div
              className="
  grid
  grid-cols-2
  md:grid-cols-3
  gap-2
  "
            >
              {reasons.map((item) => {
                const Icon = item.icon;

                const active = selectedReason === item.label;

                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedReason(item.label)}
                    className={`
  relative
  rounded-lg
  border
  p-2.5
  text-left
  transition-all
  duration-300
  min-h-[96px]

  ${
    active
      ? `
        border-red-300
        bg-red-50
      `
      : `
        border-[#E2E8F0]
        bg-[#FAFBFC]
        hover:bg-white
        hover:border-[#CBD5E1]
      `
  }
  `}
                  >
                    {/* TOP */}

                    <div
                      className="
    flex
    items-center
    justify-between
    mb-2
    "
                    >
                      {/* ICON */}

                      <div
                        className={`
      w-8
      h-8
      rounded-lg
      flex
      items-center
      justify-center

      ${
        active
          ? `
            bg-red-500
            text-white
          `
          : `
            bg-white
            border
            border-[#E2E8F0]
            text-[#64748B]
          `
      }
      `}
                      >
                        <Icon size={14} />
                      </div>

                      {/* CHECK */}

                      {active && (
                        <Check
                          size={13}
                          className="
        text-red-500
        "
                        />
                      )}
                    </div>

                    {/* TEXT */}

                    <h3
                      className={`
    text-[13px]
    font-semibold
    leading-none

    ${
      active
        ? `
          text-red-700
        `
        : `
          text-[#0F172A]
        `
    }
    `}
                    >
                      {item.label}
                    </h3>

                    <p
                      className="
    text-[10px]
    text-[#94A3B8]
    mt-1.5
    leading-4
    "
                    >
                      Report related issue
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================== */}
          {/* DESCRIPTION */}
          {/* =================================== */}

          <div className="mb-5">
            {/* LABEL */}

            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <AlertTriangle
                size={14}
                className="
                text-red-500
                "
              />

              <p
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Additional Details
              </p>
            </div>

            {/* TEXTAREA */}

            <textarea
              rows={2}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
w-full
rounded-xl
border
border-[#E2E8F0]
bg-[#FAFBFC]
px-3.5
py-3
text-[13px]
leading-5
text-[#0F172A]
placeholder:text-[#94A3B8]
outline-none
resize-none
transition-all
duration-300
focus:border-red-400
focus:bg-white
focus:ring-4
focus:ring-red-100
"
            />
          </div>

          {/* =================================== */}
          {/* WARNING */}
          {/* =================================== */}

          <div
            className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            p-3.5
            mb-5
            "
          >
            {/* ICON */}

            <div
              className="
              w-9
              h-9
              rounded-lg
              bg-amber-100
              text-amber-700
              flex
              items-center
              justify-center
              shrink-0
              "
            >
              <AlertTriangle size={16} />
            </div>

            {/* TEXT */}

            <div>
              <h3
                className="
                text-sm
                font-semibold
                text-amber-900
                mb-1
                "
              >
                False Reporting Policy
              </h3>

              <p
                className="
                text-xs
                leading-5
                text-amber-700
                "
              >
                False or misleading reports may result in moderation actions.
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
            gap-3
            "
          >
            {/* CANCEL */}

            <button
              onClick={onClose}
              className="
              flex-1
              h-10
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              hover:bg-[#F8FAFC]
              text-[#0F172A]
              text-sm
              font-semibold
              transition-all
              duration-300
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
              flex-1
              h-10
              rounded-xl
              bg-red-500
              hover:bg-red-600
              disabled:opacity-50
              text-white
              text-sm
              font-semibold
              shadow-sm
              transition-all
              duration-300
              "
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
