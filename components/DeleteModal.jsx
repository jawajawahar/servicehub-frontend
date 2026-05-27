"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export default function DeleteModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      backdrop-blur-sm
      p-4
      "
    >
      {/* MODAL */}
      <div
        className="
        relative
        w-full
        max-w-md
        overflow-hidden
        rounded-[28px]
        border
        border-[#E2E8F0]
        bg-white
        shadow-[0_25px_80px_rgba(15,23,42,0.18)]
        "
      >
        {/* TOP GLOW */}
        <div
          className="
          absolute
          top-0
          right-0
          w-52
          h-52
          bg-red-100/60
          blur-3xl
          rounded-full
          "
        />

        {/* CONTENT */}
        <div className="relative p-7">
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
            absolute
            top-5
            right-5
            w-9
            h-9
            rounded-xl
            hover:bg-[#F8FAFC]
            text-[#64748B]
            flex
            items-center
            justify-center
            transition-all
            "
          >
            <X size={16} />
          </button>

          {/* ICON */}
          <div
            className="
            w-16
            h-16
            rounded-[22px]
            bg-red-50
            border
            border-red-100
            flex
            items-center
            justify-center
            shadow-sm
            "
          >
            <AlertTriangle
              size={28}
              className="
              text-red-600
              "
            />
          </div>

          {/* TEXT */}
          <div className="mt-6">
            <h2
              className="
              text-[24px]
              font-[800]
              tracking-tight
              text-[#0F172A]
              "
            >
              Delete Job
            </h2>

            <p
              className="
              mt-3
              text-[15px]
              leading-7
              text-[#64748B]
              "
            >
              This action will permanently remove this job and all related
              activity from the platform. This cannot be undone.
            </p>
          </div>

          {/* WARNING BOX */}
          <div
            className="
            mt-6
            rounded-2xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            "
          >
            <p
              className="
              text-sm
              font-medium
              text-red-700
              leading-6
              "
            >
              Please confirm carefully before deleting this job.
            </p>
          </div>

          {/* ACTIONS */}
          <div
            className="
            mt-7
            flex
            items-center
            justify-end
            gap-3
            "
          >
            {/* CANCEL */}
            <button
              onClick={onClose}
              disabled={loading}
              className="
              h-11
              px-5
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-white
              hover:bg-[#F8FAFC]
              text-sm
              font-semibold
              text-[#0F172A]
              transition-all
              "
            >
              Cancel
            </button>

            {/* DELETE */}
            <button
              onClick={onConfirm}
              disabled={loading}
              className="
              h-11
              px-5
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
              text-sm
              font-semibold
              shadow-[0_10px_25px_rgba(220,38,38,0.22)]
              flex
              items-center
              gap-2
              transition-all
              "
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
