"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  X,
  Briefcase,
  DollarSign,
  FileText,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function ProposalModal({ open, onClose, job }) {
  const [price, setPrice] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open || !job) return null;

  // ===================================
  // SUBMIT PROPOSAL
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price || !message) {
      return toast.error("Fill all fields");
    }

    try {
      setLoading(true);

      await api.post(`/applications/${job._id}`, {
        estimatedPrice: price,

        message,
      });

      toast.success("Application sent successfully");

      onClose();

      setPrice("");

      setMessage("");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to apply");
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
      z-[300]
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
        max-w-2xl
        rounded-[36px]
        border
        border-[#E2E8F0]
        bg-white
        shadow-[0_30px_90px_rgba(15,23,42,0.20)]
        "
      >
        {/* TOP GLOW */}
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
              gap-4
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
                <Briefcase size={28} />
              </div>

              {/* TEXT */}
              <div>
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
                  <ShieldCheck size={12} />
                  Professional Proposal
                </div>

                <h2
                  className="
                  text-[32px]
                  leading-tight
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  {job.title}
                </h2>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-3
                  "
                >
                  Send your service proposal to the homeowner
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
        {/* FORM */}
        {/* =================================== */}

        <form
          onSubmit={handleSubmit}
          className="
          relative
          px-8
          py-8
          space-y-7
          "
        >
          {/* PRICE */}
          <div>
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <DollarSign
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-bold
                text-[#0F172A]
                "
              >
                Your Price
              </label>
            </div>

            {/* INPUT */}
            <div className="relative">
              <span
                className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-[22px]
                font-[900]
                text-[#2563EB]
                "
              >
                £
              </span>

              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="
                w-full
                h-16
                rounded-[24px]
                border
                border-[#E2E8F0]
                bg-[#FAFBFC]
                pl-14
                pr-5
                text-[28px]
                font-[900]
                tracking-tight
                text-[#0F172A]
                outline-none
                transition-all
                duration-300
                focus:border-[#2563EB]
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* MESSAGE */}
          <div>
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <FileText
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-bold
                text-[#0F172A]
                "
              >
                Proposal Message
              </label>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={6}
              placeholder="Describe your experience, timeline, materials, and how you can help with this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
              w-full
              rounded-[24px]
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

          {/* INFO CARD */}
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
              <ShieldCheck size={26} />
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
                Professional Tip
              </h3>

              <p
                className="
                text-sm
                leading-7
                text-emerald-700
                "
              >
                Clear pricing and a detailed proposal improve your chances of
                getting accepted.
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            className="
            flex
            items-center
            gap-4
            pt-2
            "
          >
            {/* CANCEL */}
            <button
              type="button"
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

            {/* SEND */}
            <button
              type="submit"
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
              shadow-[0_12px_30px_rgba(37,99,235,0.20)]
              flex
              items-center
              justify-center
              gap-3
              transition-all
              duration-300
              "
            >
              <Send size={17} />

              {loading ? "Sending..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
