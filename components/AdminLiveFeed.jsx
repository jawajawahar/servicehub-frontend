"use client";

import { useEffect, useState } from "react";

import io from "socket.io-client";

import { Activity, Bell, ShieldAlert, Briefcase, Users } from "lucide-react";

let socket;

export default function AdminLiveFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

    // JOIN ADMIN ROOM
    socket.emit("joinAdminRoom");

    // RECEIVE EVENTS
    socket.on("adminActivity", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ===================================
  // ICON HELPER
  // ===================================
  const getActivityIcon = (message = "") => {
    const text = message.toLowerCase();

    if (text.includes("report")) {
      return {
        icon: ShieldAlert,
        color: "bg-red-50 text-red-600",
      };
    }

    if (text.includes("job")) {
      return {
        icon: Briefcase,
        color: "bg-blue-50 text-blue-600",
      };
    }

    if (text.includes("user")) {
      return {
        icon: Users,
        color: "bg-emerald-50 text-emerald-600",
      };
    }

    return {
      icon: Bell,
      color: "bg-violet-50 text-violet-600",
    };
  };

  return (
    <div
      className="
      bg-white
      border
      border-[#E2E8F0]
      rounded-[30px]
      shadow-[0_4px_20px_rgba(15,23,42,0.04)]
      overflow-hidden
      "
    >
      {/* =================================== */}
      {/* HEADER */}
      {/* =================================== */}
      <div
        className="
        px-6
        pt-6
        pb-5
        border-b
        border-[#F1F5F9]
        "
      >
        <div
          className="
          flex
          items-start
          justify-between
          "
        >
          <div>
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <div
                className="
                w-11
                h-11
                rounded-2xl
                bg-[#EFF6FF]
                text-[#2563EB]
                flex
                items-center
                justify-center
                "
              >
                <Activity size={20} />
              </div>

              <div>
                <h2
                  className="
                  text-[20px]
                  font-[700]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Live Activity
                </h2>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-0.5
                  "
                >
                  Realtime platform monitoring
                </p>
              </div>
            </div>
          </div>

          {/* LIVE BADGE */}
          <div
            className="
            flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-xl
            bg-green-50
            border
            border-green-100
            "
          >
            <div
              className="
              w-2
              h-2
              rounded-full
              bg-green-500
              animate-pulse
              "
            />

            <span
              className="
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-green-600
              "
            >
              Live
            </span>
          </div>
        </div>
      </div>

      {/* =================================== */}
      {/* FEED */}
      {/* =================================== */}
      <div
        className="
        max-h-[520px]
        overflow-y-auto
        "
      >
        {activities.length === 0 ? (
          <div
            className="
            py-20
            flex
            flex-col
            items-center
            justify-center
            text-center
            "
          >
            <div
              className="
              w-16
              h-16
              rounded-3xl
              bg-[#F8FAFC]
              border
              border-[#E2E8F0]
              flex
              items-center
              justify-center
              mb-4
              "
            >
              <Activity
                size={28}
                className="
                text-[#94A3B8]
                "
              />
            </div>

            <h3
              className="
              text-sm
              font-semibold
              text-[#0F172A]
              "
            >
              Waiting for realtime events
            </h3>

            <p
              className="
              text-xs
              text-[#64748B]
              mt-1
              "
            >
              Incoming platform activities will appear here
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {activities.map((item, index) => {
              const activityData = getActivityIcon(item.message);

              const Icon = activityData.icon;

              return (
                <div
                  key={index}
                  className="
                  group
                  flex
                  items-start
                  gap-4
                  p-4
                  rounded-2xl
                  border
                  border-[#F1F5F9]
                  hover:border-[#DBEAFE]
                  hover:bg-[#FAFCFF]
                  transition-all
                  duration-300
                  "
                >
                  {/* ICON */}
                  <div
                    className={`
                    w-11
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    shrink-0

                    ${activityData.color}
                    `}
                  >
                    <Icon size={18} />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      "
                    >
                      <div>
                        <p
                          className="
                          text-sm
                          font-medium
                          text-[#0F172A]
                          leading-6
                          "
                        >
                          {item.message}
                        </p>

                        <p
                          className="
                          text-xs
                          text-[#94A3B8]
                          mt-2
                          "
                        >
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* LIVE STATUS */}
                      <div
                        className="
                        opacity-0
                        group-hover:opacity-100
                        transition-all
                        duration-300
                        "
                      >
                        <div
                          className="
                          flex
                          items-center
                          gap-1.5
                          px-2
                          py-1
                          rounded-lg
                          bg-[#EFF6FF]
                          text-[#2563EB]
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          "
                        >
                          <div
                            className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-[#2563EB]
                            "
                          />
                          Event
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
