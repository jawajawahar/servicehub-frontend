"use client";

import { useState } from "react";

import { PoundSterling, MessageSquare, Send, X, Sparkles } from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

export default function ApplicationModal({ jobId, onClose }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    message: "",
    estimatedPrice: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post(`/applications/${jobId}`, form);

      toast.success("Application submitted");

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      fixed
      inset-0
      z-50
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
        w-full
        max-w-2xl
        overflow-hidden
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
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                shadow-[0_10px_30px_rgba(37,99,235,0.25)]
                shrink-0
                "
              >
                <Sparkles size={20} />
              </div>

              {/* TEXT */}
              <div>
                <h2
                  className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
                  "
                >
                  PREMIUM TEST MODAL
                </h2>

                <p
                  className="
                  text-sm
                  text-slate-500
                  mt-1.5
                  leading-6
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
              <PoundSterling size={16} className="text-blue-600" />

              <label className="text-sm font-medium text-slate-800">
                Your Price
              </label>
            </div>

            {/* INPUT */}
            <div className="relative">
              <div
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
                text-base
                font-semibold
                "
              >
                £
              </div>

              <input
                type="number"
                value={form.estimatedPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimatedPrice: e.target.value,
                  })
                }
                placeholder="120"
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
              <MessageSquare size={16} className="text-blue-600" />

              <label className="text-sm font-medium text-slate-800">
                Proposal Message
              </label>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              placeholder="Describe your experience, timeline, materials, and how you can help with this project..."
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
              w-12
              h-12
              rounded-2xl
              bg-emerald-100
              text-emerald-700
              flex
              items-center
              justify-center
              shrink-0
              "
            >
              <Send size={18} />
            </div>

            {/* TEXT */}
            <div>
              <h4 className="text-sm font-semibold text-emerald-900">
                Professional Tip
              </h4>

              <p
                className="
                text-sm
                text-emerald-800/80
                mt-1.5
                leading-7
                "
              >
                Clear pricing and a detailed proposal improve your chances of
                getting accepted.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="
            flex
            items-center
            justify-end
            gap-3
            pt-1
            "
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="
              h-11
              px-5
              rounded-xl
              border
              border-slate-200
              bg-white
              hover:bg-slate-50
              text-slate-600
              text-sm
              font-medium
              transition-all
              duration-300
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
              h-11
              px-6
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-70
              text-white
              text-sm
              font-medium
              shadow-sm
              hover:shadow-md
              flex
              items-center
              gap-2
              transition-all
              duration-300
              hover:-translate-y-0.5
              "
            >
              {loading ? (
                <>
                  <div
                    className="
                    w-4
                    h-4
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                    animate-spin
                    "
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Submit Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
