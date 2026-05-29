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

  // SUBMIT PROPOSAL
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
      bg-black/50
      backdrop-blur-md
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
        rounded-[28px]
        border
        border-white/40
        bg-white/80
        backdrop-blur-2xl
        shadow-[0_25px_80px_rgba(15,23,42,0.18)]
        "
      >
        {/* BACKGROUND GLOW */}
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

        {/* HEADER */}
        <div
          className="
          relative
          px-6
          pt-6
          pb-5
          border-b
          border-slate-200/70
          bg-white/60
          backdrop-blur-xl
          "
        >
          <div className="flex items-start justify-between gap-4">
            {/* LEFT */}
            <div className="flex items-start gap-4">
              {/* ICON */}
              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-br
                from-slate-900
                to-slate-700
                text-white
                flex
                items-center
                justify-center
                shadow-lg
                shrink-0
                "
              >
                <Briefcase size={20} />
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
                  bg-blue-50
                  border
                  border-blue-100
                  text-blue-700
                  text-xs
                  font-medium
                  mb-3
                  "
                >
                  <ShieldCheck size={12} />
                  Professional Proposal
                </div>

                {/* TITLE */}
                <h2
                  className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
                  "
                >
                  {job.title}
                </h2>

                {/* SUBTEXT */}
                <p
                  className="
                  text-sm
                  text-slate-500
                  mt-1.5
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
              shrink-0
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
          relative
          px-6
          py-6
          space-y-5
          "
        >
          {/* PRICE */}
          <div>
            {/* LABEL */}
            <div className="flex items-center gap-2 mb-2.5">
              <DollarSign size={16} className="text-blue-600" />

              <label className="text-sm font-medium text-slate-800">
                Your Price
              </label>
            </div>

            {/* INPUT */}
            <div className="relative">
              <span
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-base
                font-semibold
                text-blue-600
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
                h-12
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-4
                text-lg
                font-semibold
                tracking-tight
                text-slate-800
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-300
                focus:border-blue-500
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
            <div className="flex items-center gap-2 mb-2.5">
              <FileText size={16} className="text-blue-600" />

              <label className="text-sm font-medium text-slate-800">
                Proposal Message
              </label>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={5}
              placeholder="Describe your experience, timeline, materials, and how you can help with this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              text-sm
              leading-7
              text-slate-700
              placeholder:text-slate-400
              outline-none
              resize-none
              transition-all
              duration-300
              focus:border-blue-500
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>

          {/* TIP CARD */}
          <div
            className="
            flex
            items-start
            gap-4
            rounded-2xl
            border
            border-emerald-100
            bg-emerald-50/70
            p-5
            "
          >
            {/* ICON */}
            <div
              className="
              w-11
              h-11
              rounded-xl
              bg-emerald-100
              text-emerald-700
              flex
              items-center
              justify-center
              shrink-0
              "
            >
              <ShieldCheck size={20} />
            </div>

            {/* TEXT */}
            <div>
              <h3 className="text-sm font-semibold text-emerald-900">
                Professional Tip
              </h3>

              <p
                className="
                text-sm
                leading-7
                text-emerald-800/80
                mt-1.5
                "
              >
                Clear pricing and a detailed proposal improve your chances of
                getting accepted.
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 pt-1">
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="
              flex-1
              h-11
              rounded-xl
              border
              border-slate-200
              bg-white
              hover:bg-slate-50
              text-slate-700
              text-sm
              font-medium
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
              h-11
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              text-white
              text-sm
              font-medium
              shadow-sm
              hover:shadow-md
              flex
              items-center
              justify-center
              gap-2
              transition-all
              duration-300
              hover:-translate-y-0.5
              "
            >
              <Send size={15} />

              {loading ? "Sending..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
