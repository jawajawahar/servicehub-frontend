"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { ArrowRight, ShieldCheck } from "lucide-react";

import api from "../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "homeowner",
  });

  // ===================================
  // SUBMIT
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      toast.success("Account created successfully");

      router.push("/login");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      flex
      items-center
      justify-center
      px-4
      py-10
      "
    >
      {/* CONTAINER */}
      <div
        className="
        w-full
        max-w-[420px]
        "
      >
        {/* LOGO / HEADER */}
        <div className="mb-8">
          <div
            className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            bg-blue-50
            text-blue-700
            text-xs
            font-semibold
            mb-5
            "
          >
            <ShieldCheck size={14} />
            Trusted Service Platform
          </div>

          <h1
            className="
            text-[30px]
            leading-[36px]
            font-bold
            tracking-tight
            text-[#0F172A]
            "
          >
            Create your account
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-3
            leading-7
            "
          >
            Join the platform to connect with trusted homeowners and skilled
            professionals.
          </p>
        </div>

        {/* CARD */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-6
          shadow-[0_2px_10px_rgba(15,23,42,0.03)]
          "
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label
                className="
                block
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="
                w-full
                h-11
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                px-4
                text-sm
                text-[#0F172A]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                className="
                block
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="
                w-full
                h-11
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                px-4
                text-sm
                text-[#0F172A]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                className="
                block
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="
                w-full
                h-11
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                px-4
                text-sm
                text-[#0F172A]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* ROLE */}
            <div>
              <label
                className="
                block
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                Account Type
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                className="
                w-full
                h-11
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                px-4
                text-sm
                text-[#0F172A]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              >
                <option value="homeowner">Homeowner</option>

                <option value="tradesperson">Tradesperson</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              h-11
              rounded-xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              disabled:opacity-70
              text-white
              text-sm
              font-medium
              transition-all
              flex
              items-center
              justify-center
              gap-2
              mt-2
              "
            >
              {loading ? "Creating..." : "Create Account"}

              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* FOOTER */}
          <div
            className="
            mt-5
            pt-5
            border-t
            border-[#E2E8F0]
            text-center
            "
          >
            <p
              className="
              text-sm
              text-[#64748B]
              "
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="
                text-[#2563EB]
                font-medium
                hover:underline
                "
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
