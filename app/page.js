"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import ReportModal from "../components/ReportModal";
import JobDetailsModal from "../components/JobDetailsModal";
import ProposalModal from "../components/ProposalModal";
import ChatPanel from "../components/ChatPanel";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import {
  Search,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");

  const [reportOpen, setReportOpen] = useState(false);

  const [selectedReportJob, setSelectedReportJob] = useState(null);

  const [category, setCategory] = useState("All");

  const [status, setStatus] = useState("All");

  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);

  const [selectedChatJob, setSelectedChatJob] = useState(null);

  const [proposalOpen, setProposalOpen] = useState(false);

  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  // ===================================
  // FETCH JOBS
  // ===================================
  const fetchJobs = async () => {
    try {
      setLoading(true);

      let endpoint = `/jobs?search=${search}&category=${category}&status=${status}&sort=${sort}`;

      // HOMEOWNER ONLY SEES OWN JOBS
      if (user?.role === "homeowner") {
        endpoint = `/jobs/my-jobs?search=${search}&category=${category}&status=${status}&sort=${sort}`;
      }

      const res = await api.get(endpoint);

      // HIDE OWN JOBS FOR TRADESPERSON
      const filteredJobs =
        user?.role === "tradesperson"
          ? res.data.filter((job) => job.createdBy?._id !== user.id)
          : res.data;

      setJobs(filteredJobs);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // EFFECTS
  // ===================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [user, search, category, status, sort]);

  // ===================================
  // REPORT
  // ===================================
  const handleReport = (job) => {
    setSelectedReportJob(job);

    setReportOpen(true);
  };

  // ===================================
  // APPLY
  // ===================================
  const handleApply = (job) => {
    // PREVENT APPLYING OWN JOB
    if (job.createdBy?._id === user?.id) {
      return toast.error("You cannot apply to your own job");
    }

    // ONLY TRADESPERSON
    if (user?.role !== "tradesperson") {
      return toast.error("Only tradespersons can apply");
    }

    setSelectedApplyJob(job);

    setProposalOpen(true);
  };

  // ===================================
  // DELETE
  // ===================================
  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  // ===================================
  // CHAT
  // ===================================
  const openChat = (jobId) => {
    setSelectedChatJob(jobId);

    setChatOpen(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        pt-[88px]
        pb-10
        px-4
        sm:px-6
        "
      >
        <div
          className="
          max-w-[1450px]
          mx-auto
          "
        >
          {/* HERO */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-6
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
            mb-5
            "
          >
            <div
              className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
              "
            >
              {/* LEFT */}
              <div>
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
                  mb-4
                  "
                >
                  <ShieldCheck size={14} />
                  Trusted Marketplace
                </div>

                <h1
                  className="
                  text-[30px]
                  leading-[38px]
                  font-bold
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Find Trusted Service Professionals
                </h1>

                <p
                  className="
                  mt-3
                  text-sm
                  leading-7
                  text-[#64748B]
                  max-w-2xl
                  "
                >
                  Connect with skilled professionals for plumbing, electrical,
                  painting, cleaning and more.
                </p>
              </div>

              {/* RIGHT STATS */}
              <div
                className="
                grid
                grid-cols-3
                gap-3
                "
              >
                {/* CARD */}
                <div
                  className="
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  px-4
                  py-4
                  min-w-[120px]
                  "
                >
                  <Users
                    size={18}
                    className="
                    text-blue-600
                    mb-3
                    "
                  />

                  <h3
                    className="
                    text-lg
                    font-bold
                    text-[#0F172A]
                    "
                  >
                    10K+
                  </h3>

                  <p
                    className="
                    text-xs
                    text-[#64748B]
                    mt-1
                    "
                  >
                    Users
                  </p>
                </div>

                {/* CARD */}
                <div
                  className="
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  px-4
                  py-4
                  min-w-[120px]
                  "
                >
                  <BriefcaseBusiness
                    size={18}
                    className="
                    text-blue-600
                    mb-3
                    "
                  />

                  <h3
                    className="
                    text-lg
                    font-bold
                    text-[#0F172A]
                    "
                  >
                    2K+
                  </h3>

                  <p
                    className="
                    text-xs
                    text-[#64748B]
                    mt-1
                    "
                  >
                    Jobs
                  </p>
                </div>

                {/* CARD */}
                <div
                  className="
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  px-4
                  py-4
                  min-w-[120px]
                  "
                >
                  <ShieldCheck
                    size={18}
                    className="
                    text-blue-600
                    mb-3
                    "
                  />

                  <h3
                    className="
                    text-lg
                    font-bold
                    text-[#0F172A]
                    "
                  >
                    Verified
                  </h3>

                  <p
                    className="
                    text-xs
                    text-[#64748B]
                    mt-1
                    "
                  >
                    Experts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-4
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
            mb-6
            "
          >
            {/* TOP */}
            <div
              className="
              flex
              flex-col
              xl:flex-row
              gap-3
              "
            >
              {/* SEARCH */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="
                  absolute
                  left-4
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
                  h-11
                  rounded-xl
                  border
                  border-[#E2E8F0]
                  bg-white
                  pl-11
                  pr-4
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

              {/* STATUS */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                h-11
                px-4
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
                <option value="All">All Status</option>

                <option value="Open">Open</option>

                <option value="In Progress">In Progress</option>

                <option value="Completed">Completed</option>
              </select>

              {/* SORT */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                h-11
                px-4
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
                <option value="newest">Newest</option>

                <option value="oldest">Oldest</option>
              </select>

              {/* FILTER BUTTON */}
              <button
                className="
                h-11
                px-4
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                text-sm
                font-medium
                text-[#0F172A]
                hover:bg-[#F8FAFC]
                transition-all
                flex
                items-center
                gap-2
                "
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* CATEGORY */}
            <div
              className="
              flex
              flex-wrap
              gap-2
              mt-4
              "
            >
              {[
                "All",
                "Plumbing",
                "Electrical",
                "Cleaning",
                "Painting",
                "Carpentry",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition-all

                  ${
                    category === item
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                  }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* HEADER */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-5
            "
          >
            <div>
              <h2
                className="
                text-lg
                font-semibold
                text-[#0F172A]
                "
              >
                Available Jobs
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                {jobs.length} jobs found
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div
              className="
              flex
              items-center
              justify-center
              py-28
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
          ) : jobs.length === 0 ? (
            /* EMPTY */
            <div
              className="
              bg-white
              border
              border-[#E2E8F0]
              rounded-2xl
              py-20
              px-6
              text-center
              shadow-[0_2px_10px_rgba(15,23,42,0.03)]
              "
            >
              <div className="text-5xl mb-4">🔍</div>

              <h2
                className="
                text-2xl
                font-bold
                text-[#0F172A]
                mb-3
                "
              >
                No Jobs Found
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                max-w-md
                mx-auto
                leading-7
                "
              >
                Try adjusting your search or filters to find more jobs.
              </p>
            </div>
          ) : (
            /* JOB GRID */
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
              "
            >
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDelete={handleDelete}
                  onView={setSelectedJob}
                  openChat={openChat}
                  onApply={handleApply}
                  onReport={handleReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <JobDetailsModal
        open={!!selectedJob}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* CHAT */}
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        jobId={selectedChatJob}
      />

      {/* APPLY */}
      <ProposalModal
        open={proposalOpen}
        onClose={() => setProposalOpen(false)}
        job={selectedApplyJob}
      />

      {/* REPORT */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reportedUser={selectedReportJob?.createdBy?._id}
        job={selectedReportJob?._id}
      />
    </>
  );
}
