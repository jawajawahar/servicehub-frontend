"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { Users, Briefcase, Flag, CheckCircle2 } from "lucide-react";

import AdminLiveFeed from "../../components/AdminLiveFeed";

import PlatformHealth from "../../components/PlatformHealth";

import AdminAnalyticsCharts from "../../components/AdminAnalyticsCharts";

import AdminLayout from "../../components/AdminLayout";

import api from "../../services/api";

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  // ===================================
  // FETCH DASHBOARD
  // ===================================
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      setStats(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  // ===================================
  // STAT CARDS
  // ===================================
  const statCards = [
    {
      title: "Users",

      value: stats?.users || stats?.totalUsers || 0,

      icon: Users,

      color: "bg-blue-50 text-blue-600",
    },

    {
      title: "Jobs",

      value: stats?.jobs || stats?.totalJobs || 0,

      icon: Briefcase,

      color: "bg-violet-50 text-violet-600",
    },

    {
      title: "Reports",

      value: stats?.reports || stats?.totalReports || 0,

      icon: Flag,

      color: "bg-red-50 text-red-600",
    },

    {
      title: "Completed",

      value: stats?.completedJobs || 0,

      icon: CheckCircle2,

      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <AdminLayout>
      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        "
      >
        <div
          className="
          p-5
          lg:p-6
          "
        >
          {/* =================================== */}
          {/* HEADER */}
          {/* =================================== */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-5
            "
          >
            {/* LEFT */}
            <div>
              <h1
                className="
                text-[28px]
                font-bold
                tracking-tight
                text-[#0F172A]
                "
              >
                Dashboard
              </h1>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Monitor platform activity and system performance
              </p>
            </div>

            {/* ADMIN */}
            <div
              className="
              flex
              items-center
              gap-3
              bg-white
              border
              border-[#E2E8F0]
              rounded-2xl
              px-3
              py-2
              shadow-[0_2px_8px_rgba(15,23,42,0.03)]
              "
            >
              {/* AVATAR */}
              <div
                className="
                w-10
                h-10
                rounded-xl
                bg-[#2563EB]
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-semibold
                "
              >
                A
              </div>

              {/* INFO */}
              <div>
                <p
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Admin
                </p>

                <p
                  className="
                  text-xs
                  text-[#64748B]
                  "
                >
                  Super Administrator
                </p>
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* LOADING */}
          {/* =================================== */}
          {loading ? (
            <div
              className="
              h-[60vh]
              flex
              items-center
              justify-center
              "
            >
              <div
                className="
                w-10
                h-10
                rounded-full
                border-[3px]
                border-blue-100
                border-t-blue-600
                animate-spin
                "
              />
            </div>
          ) : (
            <div className="space-y-5">
              {/* =================================== */}
              {/* TOP GRID */}
              {/* =================================== */}
              <div
                className="
                grid
                grid-cols-1
                xl:grid-cols-[1fr_320px]
                gap-5
                "
              >
                {/* PLATFORM HEALTH */}
                <div>
                  <PlatformHealth />
                </div>

                {/* LIVE FEED */}
                <div>
                  <AdminLiveFeed />
                </div>
              </div>

              {/* =================================== */}
              {/* STATS */}
              {/* =================================== */}
              <div
                className="
                grid
                grid-cols-2
                xl:grid-cols-4
                gap-4
                "
              >
                {statCards.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="
                        bg-white
                        border
                        border-[#E2E8F0]
                        rounded-2xl
                        p-4
                        shadow-[0_2px_8px_rgba(15,23,42,0.03)]
                        "
                    >
                      {/* TOP */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-4
                          "
                      >
                        <div
                          className={`
                            w-10
                            h-10
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            ${item.color}
                            `}
                        >
                          <Icon size={18} />
                        </div>

                        <span
                          className="
                            text-xs
                            text-[#94A3B8]
                            "
                        >
                          Live
                        </span>
                      </div>

                      {/* VALUE */}
                      <h2
                        className="
                          text-[28px]
                          font-bold
                          tracking-tight
                          text-[#0F172A]
                          "
                      >
                        {item.value}
                      </h2>

                      {/* LABEL */}
                      <p
                        className="
                          text-sm
                          text-[#64748B]
                          mt-1
                          "
                      >
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* =================================== */}
              {/* ANALYTICS */}
              {/* =================================== */}
              <div>
                <AdminAnalyticsCharts />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
