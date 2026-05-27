"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import io from "socket.io-client";

import {
  Activity,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  ShieldCheck,
} from "lucide-react";

let socket;

export default function PlatformHealth() {
  const [health, setHealth] = useState(null);

  const [loading, setLoading] = useState(true);

  // ===================================
  // FETCH HEALTH
  // ===================================
  const fetchHealth = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHealth(res.data);
    } catch (error) {
      console.log("HEALTH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // SOCKET CONNECTION
  // ===================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHealth();

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });

    // JOIN ADMIN ROOM
    socket.emit("joinAdminRoom");

    // LIVE UPDATES
    socket.on("platformHealthUpdate", (data) => {
      setHealth((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          users: {
            ...prev.users,

            active: data.activeUsers ?? prev.users.active,
          },

          jobs: {
            ...prev.jobs,

            open: data.openJobs ?? prev.jobs.open,

            inProgress: data.inProgressJobs ?? prev.jobs.inProgress,

            completed: data.completedJobs ?? prev.jobs.completed,
          },

          reports: {
            ...prev.reports,

            open: data.openReports ?? prev.reports.open,
          },
        };
      });
    });

    // CLEANUP
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // ===================================
  // LOADING
  // ===================================
  if (loading) {
    return (
      <div
        className="
        relative
        overflow-hidden
        bg-white
        rounded-[34px]
        border
        border-gray-100
        shadow-sm
        p-8
        "
      >
        <div
          className="
          animate-pulse
          space-y-6
          "
        >
          <div
            className="
            h-10
            w-64
            rounded-2xl
            bg-gray-200
            "
          />

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-5
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-40
                  rounded-3xl
                  bg-gray-100
                  "
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===================================
  // STATUS COLORS
  // ===================================
  const statusColor =
    health?.platformStatus === "Healthy"
      ? "text-green-600 bg-green-50 border-green-200"
      : health?.platformStatus === "Warning"
        ? "text-orange-600 bg-orange-50 border-orange-200"
        : "text-red-600 bg-red-50 border-red-200";

  // ===================================
  // KPI CARDS
  // ===================================
  const cards = [
    {
      title: "Active Users",

      value: health?.users?.active || 0,

      icon: Users,

      gradient: "from-blue-50 to-indigo-50",

      border: "border-blue-100",

      iconBg: "bg-blue-500",
    },

    {
      title: "Open Jobs",

      value: health?.jobs?.open || 0,

      icon: Briefcase,

      gradient: "from-orange-50 to-amber-50",

      border: "border-orange-100",

      iconBg: "bg-orange-500",
    },

    {
      title: "Live Workspaces",

      value: health?.jobs?.inProgress || 0,

      icon: Wifi,

      gradient: "from-purple-50 to-pink-50",

      border: "border-purple-100",

      iconBg: "bg-purple-500",
    },

    {
      title: "Open Reports",

      value: health?.reports?.open || 0,

      icon: AlertTriangle,

      gradient: "from-red-50 to-pink-50",

      border: "border-red-100",

      iconBg: "bg-red-500",
    },
  ];

  return (
    <div
      className="
    relative
    overflow-hidden
    rounded-[32px]
    border
    border-[#E2E8F0]
    bg-white
    shadow-[0_10px_40px_rgba(15,23,42,0.06)]
    "
    >
      {/* HEADER */}
      <div
        className="
      px-7
      py-6
      border-b
      border-[#EEF2F7]
      flex
      flex-col
      xl:flex-row
      xl:items-center
      xl:justify-between
      gap-5
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
            className="
          w-14
          h-14
          rounded-[22px]
          bg-[#0F172A]
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          "
          >
            <ShieldCheck size={24} />
          </div>

          {/* TEXT */}
          <div>
            <h2
              className="
            text-[28px]
            font-[900]
            tracking-tight
            text-[#0F172A]
            "
            >
              Platform Health
            </h2>

            <p
              className="
            text-sm
            text-[#64748B]
            mt-1
            "
            >
              Live system monitoring & infrastructure overview
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div
          className={`
        inline-flex
        items-center
        gap-3
        h-12
        px-5
        rounded-2xl
        border
        text-sm
        font-bold
        ${statusColor}
        `}
        >
          {/* LIVE DOT */}
          <div className="relative">
            <div
              className="
            absolute
            w-3
            h-3
            rounded-full
            bg-current
            animate-ping
            opacity-70
            "
            />

            <div
              className="
            relative
            w-3
            h-3
            rounded-full
            bg-current
            "
            />
          </div>

          {health?.platformStatus}

          <span
            className="
          text-[10px]
          uppercase
          tracking-[0.22em]
          opacity-70
          "
          >
            Live
          </span>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="p-7">
        <div
          className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
        "
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              p-6
              hover:border-[#CBD5E1]
              hover:bg-white
              transition-all
              duration-300
              "
              >
                {/* TOP */}
                <div
                  className="
                flex
                items-start
                justify-between
                gap-4
                "
                >
                  {/* TEXT */}
                  <div>
                    <p
                      className="
                    text-sm
                    font-semibold
                    text-[#64748B]
                    "
                    >
                      {card.title}
                    </p>

                    <h3
                      className="
                    text-[42px]
                    leading-none
                    font-[900]
                    tracking-tight
                    text-[#0F172A]
                    mt-4
                    "
                    >
                      {card.value}
                    </h3>
                  </div>

                  {/* ICON */}
                  <div
                    className={`
                  w-14
                  h-14
                  rounded-[22px]
                  ${card.iconBg}
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                  `}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                {/* BOTTOM TREND */}
                <div
                  className="
                mt-6
                pt-4
                border-t
                border-[#EEF2F7]
                flex
                items-center
                justify-between
                "
                >
                  <span
                    className="
                  text-xs
                  text-[#94A3B8]
                  "
                  >
                    Realtime metric
                  </span>

                  <div
                    className="
                  flex
                  items-center
                  gap-2
                  text-emerald-600
                  text-xs
                  font-bold
                  "
                  >
                    <div
                      className="
                    w-2
                    h-2
                    rounded-full
                    bg-emerald-500
                    "
                    />
                    Active
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div
          className="
        mt-7
        pt-6
        border-t
        border-[#EEF2F7]
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
        "
        >
          {/* LEFT */}
          <div
            className="
          flex
          items-center
          gap-3
          text-sm
          text-[#64748B]
          "
          >
            <Activity
              size={16}
              className="
            text-[#2563EB]
            "
            />
            Monitoring updates every few seconds via websocket
          </div>

          {/* RIGHT */}
          <div
            className="
          inline-flex
          items-center
          gap-3
          px-4
          h-11
          rounded-2xl
          bg-emerald-50
          border
          border-emerald-100
          text-emerald-700
          text-sm
          font-semibold
          "
          >
            <CheckCircle2 size={16} />
            All services operational
          </div>
        </div>
      </div>
    </div>
  );
}
