"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Search, Trash2, Briefcase, Eye, Circle } from "lucide-react";

import toast from "react-hot-toast";

import api from "../../../services/api";

import AdminLayout from "../../../components/AdminLayout";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FETCH JOBS
  // =========================
  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/jobs");

      setJobs(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, []);

  // =========================
  // DELETE JOB
  // =========================
  const deleteJob = async (id) => {
    const confirmDelete = confirm("Delete this job?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/jobs/${id}`);

      toast.success("Job deleted");

      fetchJobs();
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredJobs = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || job.status === statusFilter;

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
            Job Management
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-1
            "
          >
            Monitor marketplace projects & moderation
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
                placeholder="Search jobs..."
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

              <option>Open</option>

              <option>In Progress</option>

              <option>Completed</option>
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
            grid-cols-[2fr_1fr_140px_140px_120px]
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
            <div>Job</div>

            <div>Homeowner</div>

            <div>Status</div>

            <div>Created</div>

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
          ) : filteredJobs.length === 0 ? (
            <div
              className="
              py-20
              text-center
              "
            >
              <div className="text-4xl mb-3">📭</div>

              <p
                className="
                text-sm
                text-[#64748B]
                "
              >
                No jobs found
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="
                grid
                grid-cols-[2fr_1fr_140px_140px_120px]
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
                {/* JOB */}
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#EFF6FF]
                    text-[#2563EB]
                    flex
                    items-center
                    justify-center
                    shrink-0
                    "
                  >
                    <Briefcase size={18} />
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
                      {job.title}
                    </h3>

                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      truncate
                      mt-0.5
                      "
                    >
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* HOMEOWNER */}
                <div>
                  <p
                    className="
                    text-sm
                    font-medium
                    text-[#0F172A]
                    "
                  >
                    {job.createdBy?.name || "Unknown"}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <div
                    className={`
                    inline-flex
                    items-center
                    gap-1.5
                    px-2.5
                    py-1
                    rounded-lg
                    text-xs
                    font-medium

                    ${
                      job.status === "Completed"
                        ? `
                          bg-green-50
                          text-green-600
                        `
                        : job.status === "In Progress"
                          ? `
                          bg-blue-50
                          text-blue-600
                        `
                          : `
                          bg-yellow-50
                          text-yellow-700
                        `
                    }
                    `}
                  >
                    <Circle
                      size={10}
                      className="
                      fill-current
                      "
                    />

                    {job.status}
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    "
                  >
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* ACTIONS */}
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  "
                >
                  {/* WORKSPACE */}
                  {job.status === "In Progress" && (
                    <Link
                      href={`/workspace/${job._id}`}
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

                  {/* DELETE */}
                  <button
                    onClick={() => deleteJob(job._id)}
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
                    <Trash2 size={15} />
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
