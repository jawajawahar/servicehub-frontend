"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  CreditCard,
  Landmark,
  Wallet,
  ShieldCheck,
  Receipt,
  X,
  Download,
  CheckCircle2,
  Lock,
  BadgeCheck,
} from "lucide-react";

export default function PaymentModal({ open, onClose, job }) {
  const [loading, setLoading] = useState(false);

  const [serviceFee, setServiceFee] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const [reference, setReference] = useState("");

  // RECEIPT STATES
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [paymentData, setPaymentData] = useState(null);

  if (!open || !job) return null;

  // CALCULATIONS
  const parsedFee = Number(serviceFee) || 0;

  const platformFee = parsedFee * 0.1;

  const total = parsedFee + platformFee;

  // METHODS
  const methods = [
    {
      name: "Credit Card",

      description: "Visa & Mastercard",

      icon: CreditCard,
    },

    {
      name: "Bank Transfer",

      description: "Direct bank payment",

      icon: Landmark,
    },

    {
      name: "Digital Wallet",

      description: "Apple Pay & wallets",

      icon: Wallet,
    },
  ];

  // PAYMENT
  const handlePayment = async () => {
    try {
      // VALIDATION
      if (!parsedFee || parsedFee <= 0) {
        return toast.error("Enter valid amount");
      }

      if (paymentMethod === "Bank Transfer" && !reference) {
        return toast.error("Enter transaction reference");
      }

      setLoading(true);

      // PAYMENT API
      const res = await api.post("/payments", {
        jobId: job._id,

        amount: parsedFee,

        paymentMethod,

        reference,
      });

      // SAVE RECEIPT DATA
      setPaymentData(res.data);

      // OPEN RECEIPT
      setReceiptOpen(true);

      toast.success("Payment successful");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD RECEIPT
  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      {/* ====================================== */}
      {/* PAYMENT MODAL */}
      {/* ====================================== */}

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
          w-full
          max-w-2xl
          max-h-[88vh]
          overflow-y-auto
          rounded-[36px]
          bg-white
          border
          border-[#E2E8F0]
          shadow-[0_30px_90px_rgba(15,23,42,0.20)]
          scrollbar-thin
          scrollbar-thumb-gray-300
          scrollbar-track-transparent
          "
        >
          {/* ====================================== */}
          {/* HEADER */}
          {/* ====================================== */}

          <div
            className="
            relative
            overflow-hidden
            bg-[#0F172A]
            px-7
            py-7
            text-white
            "
          >
            {/* GLOW */}
            <div
              className="
              absolute
              top-0
              right-0
              w-64
              h-64
              bg-blue-500/20
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
              w-10
              h-10
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
              "
            >
              <X size={18} />
            </button>

            {/* CONTENT */}
            <div
              className="
              relative
              flex
              items-center
              gap-5
              "
            >
              {/* ICON */}
              <div
                className="
                w-16
                h-16
                rounded-[24px]
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
                shadow-lg
                "
              >
                <Receipt size={30} />
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
                  bg-emerald-500/15
                  border
                  border-emerald-400/20
                  text-emerald-300
                  text-xs
                  font-semibold
                  mb-3
                  "
                >
                  <Lock size={12} />
                  Secure Checkout
                </div>

                <h2
                  className="
                  text-[34px]
                  font-[900]
                  tracking-tight
                  leading-none
                  "
                >
                  Payment
                </h2>

                <p
                  className="
                  text-sm
                  text-slate-300
                  mt-2
                  "
                >
                  Protected escrow transaction
                </p>
              </div>
            </div>
          </div>

          {/* ====================================== */}
          {/* BODY */}
          {/* ====================================== */}

          <div className="p-7">
            {/* JOB CARD */}
            <div
              className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-[#E2E8F0]
              bg-[#F8FAFC]
              p-6
              mb-7
              "
            >
              <div
                className="
                absolute
                top-0
                right-0
                w-48
                h-48
                bg-blue-100/40
                blur-3xl
                rounded-full
                "
              />

              <div className="relative">
                <p
                  className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#2563EB]
                  mb-3
                  "
                >
                  Service Booking
                </p>

                <h3
                  className="
                  text-[28px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  leading-tight
                  "
                >
                  {job.title}
                </h3>
              </div>
            </div>

            {/* AMOUNT */}
            <div className="mb-7">
              <label
                className="
                block
                text-sm
                font-bold
                text-[#0F172A]
                mb-3
                "
              >
                Service Amount
              </label>

              <div className="relative">
                <span
                  className="
                  absolute
                  left-6
                  top-1/2
                  -translate-y-1/2
                  text-2xl
                  font-black
                  text-[#2563EB]
                  "
                >
                  $
                </span>

                <input
                  type="number"
                  placeholder="0.00"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  className="
                  w-full
                  h-16
                  rounded-[24px]
                  border
                  border-[#E2E8F0]
                  bg-[#F8FAFC]
                  pl-14
                  pr-5
                  text-[28px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  outline-none
                  transition-all
                  duration-300
                  focus:ring-4
                  focus:ring-blue-100
                  focus:border-[#2563EB]
                  "
                />
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="mb-7">
              <label
                className="
                block
                text-sm
                font-bold
                text-[#0F172A]
                mb-4
                "
              >
                Payment Method
              </label>

              <div className="grid gap-4">
                {methods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <button
                      key={method.name}
                      type="button"
                      onClick={() => setPaymentMethod(method.name)}
                      className={`
                        p-5
                        rounded-[24px]
                        border
                        text-left
                        transition-all
                        duration-300

                        ${
                          paymentMethod === method.name
                            ? `
                              border-[#2563EB]
                              bg-[#EFF6FF]
                              shadow-[0_8px_25px_rgba(37,99,235,0.10)]
                              `
                            : `
                              border-[#E2E8F0]
                              bg-white
                              hover:border-[#CBD5E1]
                              hover:bg-[#F8FAFC]
                              `
                        }
                        `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          "
                      >
                        {/* LEFT */}
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            "
                        >
                          {/* ICON */}
                          <div
                            className={`
                              w-14
                              h-14
                              rounded-[20px]
                              flex
                              items-center
                              justify-center
                              transition-all

                              ${
                                paymentMethod === method.name
                                  ? `
                                    bg-[#2563EB]
                                    text-white
                                  `
                                  : `
                                    bg-[#F1F5F9]
                                    text-[#475569]
                                  `
                              }
                              `}
                          >
                            <Icon size={24} />
                          </div>

                          {/* TEXT */}
                          <div>
                            <h3
                              className="
                                text-[17px]
                                font-[800]
                                tracking-tight
                                text-[#0F172A]
                                "
                            >
                              {method.name}
                            </h3>

                            <p
                              className="
                                text-sm
                                text-[#64748B]
                                mt-1
                                "
                            >
                              {method.description}
                            </p>
                          </div>
                        </div>

                        {/* CHECK */}
                        <div
                          className={`
                            w-6
                            h-6
                            rounded-full
                            border-2
                            flex
                            items-center
                            justify-center

                            ${
                              paymentMethod === method.name
                                ? `
                                  border-[#2563EB]
                                `
                                : `
                                  border-[#CBD5E1]
                                `
                            }
                            `}
                        >
                          {paymentMethod === method.name && (
                            <div
                              className="
                                w-3
                                h-3
                                rounded-full
                                bg-[#2563EB]
                                "
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BANK DETAILS */}
            {paymentMethod === "Bank Transfer" && (
              <div
                className="
                rounded-[30px]
                border
                border-[#DBEAFE]
                bg-[#EFF6FF]
                p-6
                mb-7
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  mb-6
                  "
                >
                  <div
                    className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-[#2563EB]
                    text-white
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Landmark size={22} />
                  </div>

                  <div>
                    <h3
                      className="
                      text-lg
                      font-[800]
                      text-[#0F172A]
                      "
                    >
                      Bank Details
                    </h3>

                    <p
                      className="
                      text-sm
                      text-[#64748B]
                      mt-1
                      "
                    >
                      Transfer using the details below
                    </p>
                  </div>
                </div>

                <div
                  className="
                  grid
                  grid-cols-2
                  gap-5
                  mb-6
                  "
                >
                  <div>
                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mb-2
                      "
                    >
                      Bank
                    </p>

                    <p
                      className="
                      font-bold
                      text-[#0F172A]
                      "
                    >
                      Commercial Bank
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mb-2
                      "
                    >
                      Account Name
                    </p>

                    <p
                      className="
                      font-bold
                      text-[#0F172A]
                      "
                    >
                      Service Board
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mb-2
                      "
                    >
                      Account No
                    </p>

                    <p
                      className="
                      font-bold
                      text-[#0F172A]
                      "
                    >
                      1234567890
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mb-2
                      "
                    >
                      Branch
                    </p>

                    <p
                      className="
                      font-bold
                      text-[#0F172A]
                      "
                    >
                      Colombo
                    </p>
                  </div>
                </div>

                {/* REF */}
                <div>
                  <label
                    className="
                    block
                    text-sm
                    font-bold
                    text-[#0F172A]
                    mb-3
                    "
                  >
                    Transaction Reference
                  </label>

                  <input
                    type="text"
                    placeholder="Enter transfer ID"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="
                    w-full
                    h-13
                    rounded-2xl
                    border
                    border-[#BFDBFE]
                    bg-white
                    px-5
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    focus:ring-4
                    focus:ring-blue-100
                    focus:border-[#2563EB]
                    "
                  />
                </div>
              </div>
            )}

            {/* SUMMARY */}
            <div
              className="
              rounded-[30px]
              border
              border-[#E2E8F0]
              bg-[#F8FAFC]
              p-6
              mb-7
              "
            >
              <div className="space-y-5">
                {/* ROW */}
                <div
                  className="
                  flex
                  items-center
                  justify-between
                  "
                >
                  <span className="text-[#64748B]">Service Fee</span>

                  <span
                    className="
                    font-bold
                    text-[#0F172A]
                    "
                  >
                    ${parsedFee.toFixed(2)}
                  </span>
                </div>

                {/* ROW */}
                <div
                  className="
                  flex
                  items-center
                  justify-between
                  "
                >
                  <span className="text-[#64748B]">Platform Fee</span>

                  <span
                    className="
                    font-bold
                    text-[#0F172A]
                    "
                  >
                    ${platformFee.toFixed(2)}
                  </span>
                </div>

                {/* TOTAL */}
                <div
                  className="
                  border-t
                  border-[#E2E8F0]
                  pt-5
                  flex
                  items-center
                  justify-between
                  "
                >
                  <span
                    className="
                    text-xl
                    font-[900]
                    text-[#0F172A]
                    "
                  >
                    Total
                  </span>

                  <span
                    className="
                    text-[34px]
                    font-[900]
                    tracking-tight
                    text-[#2563EB]
                    "
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div
              className="
              flex
              items-center
              gap-4
              rounded-[24px]
              border
              border-emerald-100
              bg-emerald-50
              p-5
              mb-7
              "
            >
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
                "
              >
                <ShieldCheck size={28} />
              </div>

              <div>
                <h3
                  className="
                  text-sm
                  font-bold
                  text-emerald-900
                  mb-1
                  "
                >
                  Escrow Protected
                </h3>

                <p
                  className="
                  text-sm
                  text-emerald-700
                  leading-6
                  "
                >
                  Funds remain secure until the service is successfully
                  completed.
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
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

              {/* PAY */}
              <button
                onClick={handlePayment}
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
                transition-all
                duration-300
                "
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}
      {/* RECEIPT MODAL */}
      {/* ====================================== */}

      {receiptOpen && paymentData && (
        <div
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
            className="
              w-full
              max-w-lg
              rounded-[36px]
              overflow-hidden
              bg-white
              border
              border-[#E2E8F0]
              shadow-[0_30px_90px_rgba(15,23,42,0.20)]
              "
          >
            {/* HEADER */}
            <div
              className="
                relative
                overflow-hidden
                bg-[#059669]
                px-7
                py-7
                text-white
                "
            >
              {/* GLOW */}
              <div
                className="
                  absolute
                  top-0
                  right-0
                  w-64
                  h-64
                  bg-white/10
                  blur-3xl
                  rounded-full
                  "
              />

              {/* CLOSE */}
              <button
                onClick={() => setReceiptOpen(false)}
                className="
                  absolute
                  top-5
                  right-5
                  w-10
                  h-10
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  "
              >
                <X size={18} />
              </button>

              {/* CONTENT */}
              <div
                className="
                  relative
                  flex
                  items-center
                  gap-5
                  "
              >
                <div
                  className="
                    w-16
                    h-16
                    rounded-[24px]
                    bg-white/15
                    flex
                    items-center
                    justify-center
                    "
                >
                  <CheckCircle2 size={30} />
                </div>

                <div>
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
                      mb-3
                      "
                  >
                    <BadgeCheck size={12} />
                    Payment Successful
                  </div>

                  <h2
                    className="
                      text-[34px]
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
                      mt-2
                      "
                  >
                    Transaction completed
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-7">
              {/* SERVICE */}
              <div className="mb-7">
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-[#2563EB]
                    mb-3
                    "
                >
                  Service
                </p>

                <h3
                  className="
                    text-[28px]
                    font-[900]
                    tracking-tight
                    text-[#0F172A]
                    leading-tight
                    "
                >
                  {job.title}
                </h3>
              </div>

              {/* DETAILS */}
              <div
                className="
                  rounded-[30px]
                  border
                  border-[#E2E8F0]
                  bg-[#F8FAFC]
                  p-6
                  mb-7
                  "
              >
                <div className="space-y-5">
                  <div
                    className="
                      flex
                      justify-between
                      "
                  >
                    <span className="text-[#64748B]">Amount</span>

                    <span className="font-bold text-[#0F172A]">
                      ${paymentData.amount?.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      "
                  >
                    <span className="text-[#64748B]">Platform Fee</span>

                    <span className="font-bold text-[#0F172A]">
                      ${paymentData.platformFee?.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      "
                  >
                    <span className="text-[#64748B]">Payment Method</span>

                    <span className="font-bold text-[#0F172A]">
                      {paymentMethod}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      gap-4
                      "
                  >
                    <span className="text-[#64748B]">Transaction ID</span>

                    <span
                      className="
                        font-bold
                        text-[#0F172A]
                        text-xs
                        break-all
                        text-right
                        "
                    >
                      {paymentData._id}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      justify-between
                      "
                  >
                    <span className="text-[#64748B]">Date</span>

                    <span className="font-bold text-[#0F172A]">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div
                    className="
                      border-t
                      border-[#E2E8F0]
                      pt-5
                      flex
                      justify-between
                      "
                  >
                    <span
                      className="
                        text-xl
                        font-[900]
                        text-[#0F172A]
                        "
                    >
                      Total
                    </span>

                    <span
                      className="
                        text-[30px]
                        font-[900]
                        tracking-tight
                        text-[#059669]
                        "
                    >
                      ${paymentData.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="
                  w-full
                  h-14
                  rounded-[22px]
                  bg-[#059669]
                  hover:bg-[#047857]
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-3
                  shadow-[0_12px_30px_rgba(5,150,105,0.20)]
                  transition-all
                  duration-300
                  "
              >
                <Download size={18} />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
