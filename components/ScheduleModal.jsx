"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  CalendarDays,
  Clock3,
  ShieldCheck,
  X,
  CheckCircle2,
} from "lucide-react";

export default function ScheduleModal({ open, onClose, jobId }) {
  const [scheduledDate, setScheduledDate] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // ===================================
  // SUBMIT
  // ===================================
  const handleSchedule = async () => {
    if (!scheduledDate) {
      return toast.error("Select date & time");
    }

    try {
      setLoading(true);

      await api.patch(`/jobs/schedule/${jobId}`, {
        scheduledDate,
      });

      toast.success("Visit scheduled");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Scheduling failed");
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
          bg-blue-100/40
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
                <CalendarDays size={28} />
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
                  bg-[#EFF6FF]
                  border
                  border-[#DBEAFE]
                  text-[#2563EB]
                  text-xs
                  font-semibold
                  mb-4
                  "
                >
                  <CheckCircle2 size={12} />
                  Appointment Booking
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
                  Schedule Visit
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
                  Choose a suitable appointment date and time for the service
                  visit.
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
          {/* DATE INPUT */}
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
              <Clock3
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
                Appointment Date & Time
              </p>
            </div>

            {/* INPUT CARD */}
            <div
              className="
              rounded-[30px]
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              p-5
              "
            >
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="
                w-full
                h-16
                rounded-[22px]
                border
                border-[#E2E8F0]
                bg-white
                px-5
                text-[16px]
                font-semibold
                text-[#0F172A]
                outline-none
                transition-all
                duration-300
                focus:border-[#2563EB]
                focus:ring-4
                focus:ring-blue-100
                "
              />

              {/* INFO */}
              <div
                className="
                mt-4
                flex
                items-center
                gap-2
                text-xs
                text-[#94A3B8]
                "
              >
                <Clock3 size={13} />
                Select the preferred visit schedule
              </div>
            </div>
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
                Appointment Reminder
              </h3>

              <p
                className="
                text-sm
                leading-7
                text-emerald-700
                "
              >
                Make sure both parties agree on the selected time before
                confirming the appointment.
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
              onClick={handleSchedule}
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
              {loading ? "Scheduling..." : "Schedule Visit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
