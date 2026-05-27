"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Flag,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const { logout } = useAuth();

  const menus = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },

    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
    },

    {
      label: "Jobs",
      icon: Briefcase,
      href: "/admin/jobs",
    },

    {
      label: "Reports",
      icon: Flag,
      href: "/admin/reports",
    },

    {
      label: "Payments",
      icon: Wallet,
      href: "/admin/payments",
    },

    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },

    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      flex
      "
    >
      {/* SIDEBAR */}
      <aside
        className="
        w-[280px]
        bg-white
        border-r
        border-[#E2E8F0]
        flex
        flex-col
        relative
        "
      >
        {/* TOP GLOW */}
        <div
          className="
          absolute
          top-0
          right-0
          w-40
          h-40
          bg-blue-100/40
          blur-3xl
          rounded-full
          pointer-events-none
          "
        />

        {/* LOGO */}
        <div
          className="
          h-[88px]
          px-6
          flex
          items-center
          border-b
          border-[#F1F5F9]
          relative
          z-10
          "
        >
          {/* ICON */}
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
            text-lg
            font-bold
            shadow-[0_10px_30px_rgba(37,99,235,0.25)]
            "
          >
            S
          </div>

          {/* TEXT */}
          <div className="ml-4">
            <h1
              className="
              text-[18px]
              font-[800]
              tracking-tight
              text-[#0F172A]
              "
            >
              ServiceHub
            </h1>

            <p
              className="
              text-xs
              text-[#64748B]
              mt-0.5
              "
            >
              Enterprise Admin
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div
          className="
          flex-1
          px-4
          py-5
          space-y-1.5
          overflow-y-auto
          "
        >
          {menus.map((item, index) => {
            const ActiveIcon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`
                  group
                  relative
                  flex
                  items-center
                  justify-between
                  h-12
                  px-4
                  rounded-2xl
                  transition-all
                  duration-300

                  ${
                    active
                      ? `
                        bg-[#2563EB]
                        text-white
                        shadow-[0_10px_30px_rgba(37,99,235,0.25)]
                      `
                      : `
                        text-[#475569]
                        hover:bg-[#F8FAFC]
                      `
                  }
                `}
              >
                {/* LEFT */}
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >
                  <div
                    className={`
                    flex
                    items-center
                    justify-center

                    ${
                      active
                        ? "text-white"
                        : "text-[#64748B] group-hover:text-[#2563EB]"
                    }
                    `}
                  >
                    <ActiveIcon size={18} />
                  </div>

                  <span
                    className="
                    text-sm
                    font-semibold
                    "
                  >
                    {item.label}
                  </span>
                </div>

                {/* RIGHT ICON */}
                <ChevronRight
                  size={16}
                  className={`
                  transition-all
                  duration-300

                  ${
                    active
                      ? "opacity-100 text-white"
                      : `
                        opacity-0
                        -translate-x-1
                        text-[#94A3B8]
                        group-hover:opacity-100
                        group-hover:translate-x-0
                      `
                  }
                  `}
                />
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          className="
          p-4
          border-t
          border-[#F1F5F9]
          "
        >
          {/* ADMIN CARD */}
          <div
            className="
            mb-4
            p-4
            rounded-2xl
            bg-[#F8FAFC]
            border
            border-[#E2E8F0]
            "
          >
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              {/* AVATAR */}
              <div
                className="
                w-11
                h-11
                rounded-2xl
                bg-[#2563EB]
                text-white
                flex
                items-center
                justify-center
                font-semibold
                text-sm
                "
              >
                A
              </div>

              {/* INFO */}
              <div>
                <h3
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Administrator
                </h3>

                <p
                  className="
                  text-xs
                  text-[#64748B]
                  mt-0.5
                  "
                >
                  System Control
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="
            w-full
            h-11
            rounded-xl
            bg-red-50
            hover:bg-red-100
            text-red-600
            text-sm
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            transition-all
            duration-200
            "
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="
        flex-1
        overflow-y-auto
        "
      >
        {children}
      </main>
    </div>
  );
}
