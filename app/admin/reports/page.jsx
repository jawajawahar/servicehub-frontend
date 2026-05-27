"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Search,
  Flag,
  CheckCircle2,
  Eye,
  Ban,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../../services/api";

import AdminLayout from "../../../components/AdminLayout";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    try {
      const res = await api.get("/admin/reports");

      setReports(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, []);

  // =========================
  // RESOLVE REPORT
  // =========================
  const resolveReport = async (id) => {
    try {
      await api.patch(`/admin/reports/${id}/resolve`);

      toast.success("Report resolved");

      fetchReports();
    } catch (error) {
      console.error(error);

      toast.error("Failed to resolve");
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredReports = reports.filter((report) => {
    const matchSearch = (report.reason || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || report.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        p-5
        lg:p-6
        "
      >
        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}
        <div className="mb-5">
          <h1
            className="
            text-[28px]
            font-bold
            tracking-tight
            text-[#0F172A]
            "
          >
            Reports & Disputes
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-1
            "
          >
            Trust & safety moderation center
          </p>
        </div>

        {/* =================================== */}
        {/* FILTER BAR */}
        {/* =================================== */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-4
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          mb-4
          "
        >
          <div
            className="
            flex
            flex-col
            lg:flex-row
            gap-3
            "
          >
            {/* SEARCH */}
            <div
              className="
              flex-1
              relative
              "
            >
              <Search
                size={16}
                className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#94A3B8]
                "
              />

              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full
                h-10
                pl-10
                pr-3
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
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

            {/* FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
              h-10
              px-3
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              text-sm
              text-[#0F172A]
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
            >
              <option>All</option>

              <option>Pending</option>

              <option>Resolved</option>
            </select>
          </div>
        </div>

        {/* =================================== */}
        {/* TABLE */}
        {/* =================================== */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          overflow-hidden
          "
        >
          {/* TABLE HEADER */}
          <div
            className="
            grid
            grid-cols-[1.5fr_140px_2fr_140px_140px]
            gap-4
            px-5
            py-3
            border-b
            border-[#E2E8F0]
            bg-[#F8FAFC]
            text-[11px]
            font-semibold
            uppercase
            tracking-wide
            text-[#64748B]
            "
          >
            <div>Reporter</div>

            <div>Type</div>

            <div>Reason</div>

            <div>Status</div>

            <div>Actions</div>
          </div>

          {/* LOADING */}
          {loading ? (
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
          ) : filteredReports.length === 0 ? (
            <div
              className="
              py-20
              text-center
              "
            >
              <div className="text-4xl mb-3">🚨</div>

              <p
                className="
                text-sm
                text-[#64748B]
                "
              >
                No reports found
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report._id}
                className="
                grid
                grid-cols-[1.5fr_140px_2fr_140px_140px]
                gap-4
                px-5
                py-4
                border-b
                border-[#F1F5F9]
                items-center
                hover:bg-[#FAFBFC]
                transition-all
                "
              >
                {/* REPORTER */}
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                  "
                >
                  {/* AVATAR */}
                  <div
                    className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#DC2626]
                    text-white
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                    shrink-0
                    "
                  >
                    {(report.reportedBy || report.reporter)?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0">
                    <h3
                      className="
                      text-sm
                      font-medium
                      text-[#0F172A]
                      truncate
                      "
                    >
                      {(report.reportedBy || report.reporter)?.name ||
                        "Unknown User"}
                    </h3>

                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      truncate
                      mt-0.5
                      "
                    >
                      {(report.reportedBy || report.reporter)?.email ||
                        "No email"}
                    </p>
                  </div>
                </div>

                {/* TYPE */}
                <div>
                  <div
                    className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    bg-red-50
                    text-red-600
                    text-xs
                    font-medium
                    "
                  >
                    <AlertTriangle size={13} />

                    {report.type}
                  </div>
                </div>

                {/* REASON */}
                <div>
                  <p
                    className="
                    text-sm
                    text-[#334155]
                    leading-6
                    line-clamp-2
                    "
                  >
                    {report.reason}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  {(report.status || "Pending") === "Resolved" ? (
                    <span
                      className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-lg
                      bg-green-50
                      text-green-600
                      text-xs
                      font-medium
                      "
                    >
                      <CheckCircle2 size={13} />
                      Resolved
                    </span>
                  ) : (
                    <span
                      className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-lg
                      bg-yellow-50
                      text-yellow-700
                      text-xs
                      font-medium
                      "
                    >
                      <Flag size={13} />
                      Pending
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >
                  {/* VIEW */}
                  {report.job?._id && (
                    <Link
                      href={`/workspace/${report.job?._id}`}
                      className="
                      w-8
                      h-8
                      rounded-lg
                      bg-blue-50
                      hover:bg-blue-100
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      transition-all
                      "
                    >
                      <Eye size={15} />
                    </Link>
                  )}

                  {/* RESOLVE */}
                  {report.status !== "Resolved" && (
                    <button
                      onClick={() => resolveReport(report._id)}
                      className="
                      w-8
                      h-8
                      rounded-lg
                      bg-green-50
                      hover:bg-green-100
                      text-green-600
                      flex
                      items-center
                      justify-center
                      transition-all
                      "
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  )}

                  {/* BLOCK */}
                  <button
                    className="
                    w-8
                    h-8
                    rounded-lg
                    bg-red-50
                    hover:bg-red-100
                    text-red-600
                    flex
                    items-center
                    justify-center
                    transition-all
                    "
                  >
                    <Ban size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
