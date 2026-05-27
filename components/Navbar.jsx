"use client";

import socket from "../lib/socket";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";

import { Home, PlusSquare, User2, LogOut } from "lucide-react";

import EditProfileModal from "./EditProfileModal";

import ApplicationPanel from "./ApplicationPanel";

import NotificationBell from "./NotificationBell";

import WorkspaceDropdown from "./WorkspaceDropdown";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  // =========================
  // HOOKS
  // =========================
  const pathname = usePathname();

  const { user, logout } = useAuth();

  // =========================
  // STATES
  // =========================
  const [mounted, setMounted] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // =========================
  // SOCKET
  // =========================
  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinUserRoom", user._id);

    console.log("SOCKET CONNECTED:", user._id);

    return () => {
      console.log("Navbar unmounted");
    };
  }, [user]);

  // =========================
  // HYDRATION FIX
  // =========================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // =========================
  // PAGE CHECK
  // =========================
  const isWorkspacePage = pathname?.startsWith("/workspace");

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
        sticky
        top-0
        z-50
        border-b
        border-[#E2E8F0]
        bg-white/80
        backdrop-blur-2xl
        shadow-[0_6px_30px_rgba(15,23,42,0.04)]
        "
      >
        <div
          className="
          max-w-[1600px]
          mx-auto
          px-5
          lg:px-7
          h-[74px]
          flex
          items-center
          justify-between
          gap-5
          "
        >
          {/* =================================== */}
          {/* LEFT */}
          {/* =================================== */}
          <div
            className="
            flex
            items-center
            gap-8
            min-w-0
            "
          >
            {/* LOGO */}
            <Link
              href="/"
              className="
              flex
              items-center
              gap-3
              shrink-0
              "
            >
              {/* ICON */}
              <div
                className="
                relative
                w-11
                h-11
                rounded-2xl
                bg-gradient-to-br
                from-[#2563EB]
                via-[#4F46E5]
                to-[#7C3AED]
                text-white
                flex
                items-center
                justify-center
                font-black
                text-lg
                shadow-[0_12px_30px_rgba(37,99,235,0.20)]
                "
              >
                S
              </div>

              {/* TEXT */}
              <div className="hidden sm:block">
                <h1
                  className="
                  text-[22px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  leading-none
                  "
                >
                  ServiceHub
                </h1>

                <p
                  className="
                  text-[11px]
                  text-[#94A3B8]
                  mt-1
                  "
                >
                  Professional Marketplace
                </p>
              </div>
            </Link>

            {/* NAVIGATION */}
            {!isWorkspacePage && (
              <div
                className="
                hidden
                lg:flex
                items-center
                gap-2
                "
              >
                {/* WORKSPACE */}
                {user && <WorkspaceDropdown />}

                {/* HOME */}
                <Link
                  href="/"
                  className={`
                  h-11
                  px-4
                  rounded-2xl
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    pathname === "/"
                      ? `
                        bg-[#2563EB]
                        text-white
                        shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                      `
                      : `
                        text-[#475569]
                        hover:bg-[#F8FAFC]
                      `
                  }
                  `}
                >
                  <Home size={16} />
                  Home
                </Link>

                {/* POST JOB */}
                {user?.role === "homeowner" && (
                  <Link
                    href="/jobs/new"
                    className={`
                    h-11
                    px-4
                    rounded-2xl
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      pathname === "/jobs/new"
                        ? `
                          bg-[#2563EB]
                          text-white
                          shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                        `
                        : `
                          text-[#475569]
                          hover:bg-[#F8FAFC]
                        `
                    }
                    `}
                  >
                    <PlusSquare size={16} />
                    Post Job
                  </Link>
                )}

                {/* PROFILE */}
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="
                  h-11
                  px-4
                  rounded-2xl
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-[#475569]
                  hover:bg-[#F8FAFC]
                  transition-all
                  duration-300
                  "
                >
                  <User2 size={16} />
                  Profile
                </button>
              </div>
            )}

            {/* WORKSPACE BADGE */}
            {isWorkspacePage && (
              <div
                className="
                hidden
                lg:flex
                items-center
                gap-3
                px-4
                h-11
                rounded-2xl
                bg-[#EFF6FF]
                border
                border-[#DBEAFE]
                "
              >
                <div
                  className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-emerald-500
                  animate-pulse
                  "
                />

                <span
                  className="
                  text-sm
                  font-semibold
                  text-[#2563EB]
                  "
                >
                  Live Workspace
                </span>
              </div>
            )}
          </div>

          {/* =================================== */}
          {/* RIGHT */}
          {/* =================================== */}
          <div
            className="
            flex
            items-center
            gap-3
            shrink-0
            "
          >
            {/* PANELS */}
            {!isWorkspacePage && user && (
              <>
                {user?.role === "homeowner" && <ApplicationPanel />}

                <NotificationBell />
              </>
            )}

            {/* AUTH */}
            {user ? (
              <>
                {/* USER CARD */}
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  h-12
                  pl-2
                  pr-4
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-white
                  shadow-sm
                  "
                >
                  {/* AVATAR */}
                  <div
                    className="
                    relative
                    w-9
                    h-9
                    rounded-2xl
                    bg-gradient-to-br
                    from-[#2563EB]
                    to-[#4F46E5]
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-sm
                    shadow-md
                    "
                  >
                    {user.name?.charAt(0)?.toUpperCase()}

                    {/* ONLINE DOT */}
                    <div
                      className="
                      absolute
                      bottom-0
                      right-0
                      w-2.5
                      h-2.5
                      rounded-full
                      bg-emerald-500
                      border-2
                      border-white
                      "
                    />
                  </div>

                  {/* INFO */}
                  <div className="hidden sm:block">
                    <p
                      className="
                      text-sm
                      font-[700]
                      text-[#0F172A]
                      leading-none
                      "
                    >
                      {user.name}
                    </p>

                    <p
                      className="
                      text-[11px]
                      text-[#94A3B8]
                      capitalize
                      mt-1
                      "
                    >
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="
                  h-11
                  px-4
                  rounded-2xl
                  bg-red-50
                  hover:bg-red-100
                  border
                  border-red-100
                  text-red-600
                  text-sm
                  font-semibold
                  flex
                  items-center
                  gap-2
                  transition-all
                  duration-300
                  "
                >
                  <LogOut size={16} />

                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <Link
                  href="/login"
                  className="
                  h-11
                  px-5
                  rounded-2xl
                  bg-[#2563EB]
                  hover:bg-[#1D4ED8]
                  text-white
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                  "
                >
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  href="/register"
                  className="
                  h-11
                  px-5
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-white
                  hover:bg-[#F8FAFC]
                  text-[#0F172A]
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* PROFILE MODAL */}
      <EditProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
