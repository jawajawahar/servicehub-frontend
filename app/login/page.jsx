"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import { ShieldCheck, User, Wrench } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("homeowner");

  // ===================================
  // LOGIN
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // LOGIN API
      const res = await api.post("/auth/login", form);

      // ROLE VALIDATION
      if (res.data.user.role !== role) {
        return toast.error(`Please login as ${res.data.user.role}`);
      }

      // SAVE AUTH
      login(res.data);

      toast.success("Login successful");

      // REDIRECT
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // ROLES
  // ===================================
  const roles = [
    {
      value: "homeowner",

      label: "Homeowner",

      icon: User,
    },

    {
      value: "tradesperson",

      label: "Tradesperson",

      icon: Wrench,
    },

    {
      value: "admin",

      label: "Admin",

      icon: ShieldCheck,
    },
  ];

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      flex
      items-center
      justify-center
      px-4
      py-6
      "
    >
      {/* CARD */}
      <div
        className="
        w-full
        max-w-[390px]
        bg-white
        border
        border-[#E2E8F0]
        rounded-2xl
        shadow-[0_2px_10px_rgba(15,23,42,0.03)]
        p-5
        "
      >
        {/* HEADER */}
        <div className="mb-5">
          <h1
            className="
            text-[26px]
            font-bold
            tracking-tight
            text-[#0F172A]
            "
          >
            Welcome back
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-1.5
            "
          >
            Login to your account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Login As
            </label>

            <div
              className="
              grid
              grid-cols-3
              gap-2
              "
            >
              {roles.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    className={`
                      h-[72px]
                      rounded-xl
                      border
                      transition-all
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1.5

                      ${
                        role === item.value
                          ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                          : "border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]"
                      }
                      `}
                  >
                    <Icon size={16} />

                    <span
                      className="
                        text-[11px]
                        font-medium
                        "
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
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
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,

                  email: e.target.value,
                })
              }
              className="
              w-full
              h-10
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              px-3
              text-sm
              text-[#0F172A]
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
              required
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
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,

                  password: e.target.value,
                })
              }
              className="
              w-full
              h-10
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              px-3
              text-sm
              text-[#0F172A]
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
              required
            />
          </div>

          {/* ADMIN INFO */}
          {role === "admin" && (
            <div
              className="
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-3
              py-2.5
              "
            >
              <p
                className="
                text-xs
                leading-6
                text-amber-700
                "
              >
                Admin accounts are managed securely by the platform owner.
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            h-10
            rounded-xl
            bg-[#2563EB]
            hover:bg-[#1D4ED8]
            disabled:opacity-70
            text-white
            text-sm
            font-medium
            transition-all
            mt-1
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <div
          className="
          mt-5
          pt-4
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
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="
              text-[#2563EB]
              font-medium
              hover:underline
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
