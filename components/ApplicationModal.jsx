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
        rounded-[32px]
        bg-white
        border
        border-[#E2E8F0]
        shadow-[0_25px_80px_rgba(15,23,42,0.18)]
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

        {/* HEADER */}
        <div
          className="
          relative
          px-8
          pt-8
          pb-6
          border-b
          border-[#F1F5F9]
          "
        >
          <div
            className="
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
              {/* ICON */}
              <div
                className="
                w-14
                h-14
                rounded-3xl
                bg-gradient-to-br
                from-blue-600
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                shadow-[0_12px_30px_rgba(37,99,235,0.25)]
                shrink-0
                "
              >
                <Sparkles size={24} />
              </div>

              {/* TEXT */}
              <div>
                <h2
                  className="
                  text-[28px]
                  font-[800]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Submit Proposal
                </h2>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-2
                  leading-6
                  "
                >
                  Send a professional application to the homeowner with pricing
                  and project details.
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
          px-8
          py-7
          space-y-6
          "
        >
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
              <MessageSquare
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Proposal Message
              </label>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              placeholder="Describe your experience, timeline, and how you can help with this project..."
              className="
              w-full
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              px-5
              py-4
              text-[15px]
              leading-7
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
              <PoundSterling
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Estimated Price
              </label>
            </div>

            {/* INPUT */}
            <div className="relative">
              <div
                className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-[#64748B]
                text-sm
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
                h-14
                rounded-2xl
                border
                border-[#E2E8F0]
                bg-[#FAFBFC]
                pl-10
                pr-5
                text-[15px]
                text-[#0F172A]
                placeholder:text-[#94A3B8]
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

          {/* INFO CARD */}
          <div
            className="
            p-5
            rounded-2xl
            bg-[#F8FAFC]
            border
            border-[#EEF2F7]
            "
          >
            <div
              className="
              flex
              items-start
              gap-3
              "
            >
              <div
                className="
                w-10
                h-10
                rounded-2xl
                bg-[#EFF6FF]
                text-[#2563EB]
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <Send size={18} />
              </div>

              <div>
                <h4
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Professional Tip
                </h4>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-1
                  leading-6
                  "
                >
                  A detailed proposal with pricing transparency increases your
                  chances of getting hired.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="
            flex
            items-center
            justify-end
            gap-3
            pt-2
            "
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="
              h-12
              px-5
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-white
              hover:bg-[#F8FAFC]
              text-[#475569]
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
              type="submit"
              disabled={loading}
              className="
              h-12
              px-6
              rounded-2xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              disabled:opacity-70
              text-white
              text-sm
              font-semibold
              shadow-[0_10px_25px_rgba(37,99,235,0.20)]
              flex
              items-center
              gap-2
              transition-all
              duration-300
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
                  <Send size={16} />
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
