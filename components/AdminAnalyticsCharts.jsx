"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

import { Briefcase, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

export default function AdminAnalyticsCharts() {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // MONTH LABELS
  // =========================
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // =========================
  // FETCH ANALYTICS
  // =========================
  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics");

      setAnalytics(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
  }, []);

  // =========================
  // FORMAT DATA
  // =========================
  const revenueData =
    analytics?.revenueAnalytics?.map((item) => ({
      month: months[item._id.month - 1],
      revenue: item.revenue,
    })) || [];

  const jobsData =
    analytics?.jobsAnalytics?.map((item) => ({
      month: months[item._id.month - 1],
      jobs: item.jobs,
    })) || [];

  const usersData =
    analytics?.usersAnalytics?.map((item) => ({
      month: months[item._id.month - 1],
      users: item.users,
    })) || [];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="
        py-20
        flex
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
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* =================================== */}
      {/* MODERN ANALYTICS BAR */}
      {/* =================================== */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
        "
      >
        {[
          {
            title: "Active Workspaces",
            value: analytics?.insights?.activeWorkspaces,
            icon: Activity,
          },

          {
            title: "Completed Jobs",
            value: analytics?.insights?.completedJobs,
            icon: CheckCircle2,
          },

          {
            title: "Pending Reports",
            value: analytics?.insights?.pendingReports,
            icon: AlertTriangle,
          },

          {
            title: "Completion Rate",
            value: `${analytics?.insights?.completionRate}%`,
            icon: Briefcase,
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
              bg-white
              border
              border-[#E2E8F0]
              rounded-[28px]
              p-5
              shadow-[0_4px_20px_rgba(15,23,42,0.04)]
              hover:-translate-y-1
              hover:shadow-[0_10px_35px_rgba(15,23,42,0.08)]
              transition-all
              duration-300
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
                  <p
                    className="
                    text-[13px]
                    font-medium
                    text-[#64748B]
                    "
                  >
                    {item.title}
                  </p>

                  <h2
                    className="
                    text-[34px]
                    font-[800]
                    tracking-tight
                    text-[#0F172A]
                    mt-4
                    "
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#EFF6FF]
                  text-[#2563EB]
                  flex
                  items-center
                  justify-center
                  "
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================== */}
      {/* CHARTS */}
      {/* =================================== */}
      <div
        className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        "
      >
        {/* REVENUE */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-[30px]
          p-6
          shadow-[0_4px_20px_rgba(15,23,42,0.04)]
          hover:-translate-y-1
          hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]
          transition-all
          duration-300
          "
        >
          {/* HEADER */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-6
            "
          >
            <div>
              <h2
                className="
                text-[20px]
                font-[700]
                tracking-tight
                text-[#0F172A]
                "
              >
                Revenue Growth
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Marketplace earnings overview
              </p>
            </div>

            <div
              className="
              px-3
              py-1
              rounded-xl
              bg-green-50
              text-green-600
              text-xs
              font-medium
              "
            >
              +12.4%
            </div>
          </div>

          {/* CHART */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />

                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="2 8"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="month"
                  tickMargin={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#CBD5E1",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    color: "#0F172A",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  }}
                />

                <Area
                  type="natural"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={4}
                  dot={false}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* JOBS */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-[30px]
          p-6
          shadow-[0_4px_20px_rgba(15,23,42,0.04)]
          hover:-translate-y-1
          hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]
          transition-all
          duration-300
          "
        >
          {/* HEADER */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-6
            "
          >
            <div>
              <h2
                className="
                text-[20px]
                font-[700]
                tracking-tight
                text-[#0F172A]
                "
              >
                Job Growth
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Marketplace activity trends
              </p>
            </div>

            <div
              className="
              px-3
              py-1
              rounded-xl
              bg-blue-50
              text-blue-600
              text-xs
              font-medium
              "
            >
              Live
            </div>
          </div>

          {/* CHART */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={jobsData}
                barCategoryGap="35%"
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="2 8"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="month"
                  tickMargin={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#CBD5E1",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    color: "#0F172A",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  }}
                />

                <Bar
                  dataKey="jobs"
                  fill="#3B82F6"
                  radius={[30, 30, 8, 8]}
                  barSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =================================== */}
      {/* USER GROWTH */}
      {/* =================================== */}
      <div
        className="
        bg-white
        border
        border-[#E2E8F0]
        rounded-[30px]
        p-6
        shadow-[0_4px_20px_rgba(15,23,42,0.04)]
        hover:-translate-y-1
        hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]
        transition-all
        duration-300
        "
      >
        {/* HEADER */}
        <div
          className="
          flex
          items-center
          justify-between
          mb-6
          "
        >
          <div>
            <h2
              className="
              text-[20px]
              font-[700]
              tracking-tight
              text-[#0F172A]
              "
            >
              User Growth
            </h2>

            <p
              className="
              text-sm
              text-[#64748B]
              mt-1
              "
            >
              Platform registration analytics
            </p>
          </div>

          <div
            className="
            px-3
            py-1
            rounded-xl
            bg-emerald-50
            text-emerald-600
            text-xs
            font-medium
            "
          >
            Updated
          </div>
        </div>

        {/* CHART */}
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={usersData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="2 8"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                tickMargin={10}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#CBD5E1",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "16px",
                  color: "#0F172A",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                }}
              />

              <Line
                type="natural"
                dataKey="users"
                stroke="#06B6D4"
                strokeWidth={4}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 0,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
