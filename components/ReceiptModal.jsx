"use client";

import {
  Download,
  X,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  CalendarDays,
  CreditCard,
} from "lucide-react";

export default function ReceiptModal({ open, onClose, payment }) {
  if (!open || !payment) return null;

  // ===================================
  // DOWNLOAD
  // ===================================
  const handleDownload = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="
      fixed
      inset-0
      z-[400]
      bg-[#020617]/70
      backdrop-blur-xl
      flex
      items-center
      justify-center
      p-4
      "
    >
      {/* RECEIPT */}
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
        print:shadow-none
        print:border-none
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
          bg-emerald-100/40
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
          overflow-hidden
          bg-[#059669]
          px-8
          py-8
          text-white
          "
        >
          {/* SHAPE */}
          <div
            className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-white/10
            blur-3xl
            rounded-full
            "
          />

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
            absolute
            top-5
            right-5
            w-11
            h-11
            rounded-2xl
            bg-white/10
            hover:bg-white/20
            border
            border-white/10
            flex
            items-center
            justify-center
            transition-all
            duration-300
            print:hidden
            "
          >
            <X size={18} />
          </button>

          {/* CONTENT */}
          <div
            className="
            relative
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
              bg-white/15
              border
              border-white/10
              flex
              items-center
              justify-center
              shadow-lg
              shrink-0
              "
            >
              <CheckCircle2 size={30} />
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
                bg-white/10
                border
                border-white/10
                text-xs
                font-semibold
                mb-4
                "
              >
                <ShieldCheck size={12} />
                Payment Successful
              </div>

              {/* TITLE */}
              <h2
                className="
                text-[36px]
                font-[900]
                tracking-tight
                leading-none
                "
              >
                Receipt
              </h2>

              <p
                className="
                text-sm
                text-emerald-100
                mt-3
                "
              >
                Transaction completed successfully
              </p>
            </div>
          </div>
        </div>

        {/* =================================== */}
        {/* BODY */}
        {/* =================================== */}

        <div className="relative p-8">
          {/* SERVICE */}
          <div className="mb-8">
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <Receipt
                size={14}
                className="
                text-[#2563EB]
                "
              />

              <p
                className="
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#2563EB]
                "
              >
                Service
              </p>
            </div>

            <h3
              className="
              text-[32px]
              font-[900]
              tracking-tight
              leading-tight
              text-[#0F172A]
              "
            >
              {payment.job?.title}
            </h3>
          </div>

          {/* =================================== */}
          {/* DETAILS CARD */}
          {/* =================================== */}

          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-[#F8FAFC]
            p-7
            mb-7
            "
          >
            <div className="space-y-6">
              {/* AMOUNT */}
              <div
                className="
                flex
                items-center
                justify-between
                "
              >
                <span
                  className="
                  text-[#64748B]
                  "
                >
                  Service Amount
                </span>

                <span
                  className="
                  font-bold
                  text-[#0F172A]
                  "
                >
                  ${payment.amount?.toFixed(2)}
                </span>
              </div>

              {/* PLATFORM */}
              <div
                className="
                flex
                items-center
                justify-between
                "
              >
                <span
                  className="
                  text-[#64748B]
                  "
                >
                  Platform Fee
                </span>

                <span
                  className="
                  font-bold
                  text-[#0F172A]
                  "
                >
                  ${payment.platformFee?.toFixed(2)}
                </span>
              </div>

              {/* METHOD */}
              <div
                className="
                flex
                items-center
                justify-between
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  text-[#64748B]
                  "
                >
                  <CreditCard size={15} />
                  Payment Method
                </div>

                <span
                  className="
                  font-bold
                  text-[#0F172A]
                  "
                >
                  {payment.paymentMethod}
                </span>
              </div>

              {/* TRANSACTION */}
              <div
                className="
                flex
                items-start
                justify-between
                gap-5
                "
              >
                <span
                  className="
                  text-[#64748B]
                  "
                >
                  Transaction ID
                </span>

                <span
                  className="
                  font-bold
                  text-[#0F172A]
                  text-sm
                  break-all
                  text-right
                  max-w-[230px]
                  "
                >
                  {payment._id}
                </span>
              </div>

              {/* DATE */}
              <div
                className="
                flex
                items-center
                justify-between
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  text-[#64748B]
                  "
                >
                  <CalendarDays size={15} />
                  Date
                </div>

                <span
                  className="
                  font-bold
                  text-[#0F172A]
                  "
                >
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* TOTAL */}
              <div
                className="
                border-t
                border-[#E2E8F0]
                pt-6
                flex
                items-center
                justify-between
                "
              >
                <span
                  className="
                  text-[24px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Total
                </span>

                <span
                  className="
                  text-[38px]
                  leading-none
                  font-[900]
                  tracking-tight
                  text-[#059669]
                  "
                >
                  ${payment.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* SECURITY CARD */}
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
            mb-7
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
                Secure Transaction
              </h3>

              <p
                className="
                text-sm
                leading-7
                text-emerald-700
                "
              >
                This payment has been securely processed and recorded
                successfully.
              </p>
            </div>
          </div>

          {/* =================================== */}
          {/* DOWNLOAD */}
          {/* =================================== */}

          <button
            onClick={handleDownload}
            className="
            w-full
            h-14
            rounded-[22px]
            bg-[#059669]
            hover:bg-[#047857]
            text-white
            text-sm
            font-bold
            shadow-[0_12px_30px_rgba(5,150,105,0.20)]
            flex
            items-center
            justify-center
            gap-3
            transition-all
            duration-300
            print:hidden
            "
          >
            <Download size={18} />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
