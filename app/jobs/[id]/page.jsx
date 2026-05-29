"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { MapPin, Briefcase, ArrowLeft } from "lucide-react";

import Navbar from "../../../components/Navbar";

import api from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import ApplicationList from "../../../components/ApplicationList";

import { getApplications } from "../../../services/applicationService";

import ApplicationModal from "../../../components/ApplicationModal";

export default function JobDetailPage() {
  const { id } = useParams();

  const router = useRouter();

  const { user } = useAuth();

  const [job, setJob] = useState(null);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showApplyModal, setShowApplyModal] = useState(false);

  // ===================================
  // FETCH JOB
  // ===================================
  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      setJob(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // FETCH APPLICATIONS
  // ===================================
  const fetchApplications = async () => {
    try {
      const data = await getApplications(id);

      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchJob();

      fetchApplications();
    }
  }, [id]);

  // ===================================
  // UPDATE STATUS
  // ===================================
  const updateStatus = async (status) => {
    try {
      await api.patch(`/jobs/${id}`, {
        status,
      });

      setJob({
        ...job,

        status,
      });

      toast.success("Status updated");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // ===================================
  // LOADING
  // ===================================
  if (loading || !job) {
    return (
      <>
        <Navbar />

        <div
          className="
          min-h-screen
          bg-[#F8FAFC]
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
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        pt-[84px]
        px-4
        pb-6
        "
      >
        <div
          className="
          max-w-[1000px]
          mx-auto
          "
        >
          {/* TOP BAR */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-4
            "
          >
            {/* LEFT */}
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <button
                onClick={() => router.push("/")}
                className="
                w-9
                h-9
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                hover:bg-[#F8FAFC]
                flex
                items-center
                justify-center
                transition-all
                "
              >
                <ArrowLeft
                  size={16}
                  className="
                  text-[#475569]
                  "
                />
              </button>

              <div>
                <h1
                  className="
                  text-[24px]
                  font-bold
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Job Details
                </h1>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-1
                  "
                >
                  View complete service request information
                </p>
              </div>
            </div>

            {/* APPLY */}
            {user &&
              user.role === "tradesperson" &&
              user.id !== job.createdBy?._id && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="
                  h-10
                  px-4
                  rounded-xl
                  bg-[#2563EB]
                  hover:bg-[#1D4ED8]
                  text-white
                  text-sm
                  font-medium
                  transition-all
                  "
                >
                  Apply Now
                </button>
              )}
          </div>

          {/* CARD */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
            overflow-hidden
            "
          >
            {/* HEADER */}
            <div
              className="
              px-5
              py-4
              border-b
              border-[#E2E8F0]
              "
            >
              {/* BADGES */}
              <div
                className="
                flex
                items-center
                gap-2
                mb-3
                "
              >
                <span
                  className="
                  px-3
                  py-1
                  rounded-lg
                  bg-[#EFF6FF]
                  text-[#2563EB]
                  text-xs
                  font-medium
                  "
                >
                  {job.category}
                </span>

                <span
                  className="
                  px-3
                  py-1
                  rounded-lg
                  bg-green-50
                  text-green-700
                  text-xs
                  font-medium
                  "
                >
                  {job.status}
                </span>
              </div>

              {/* TITLE */}
              <h2
                className="
                text-[26px]
                font-bold
                tracking-tight
                text-[#0F172A]
                "
              >
                {job.title}
              </h2>

              {/* META */}
              <div
                className="
                flex
                flex-wrap
                items-center
                gap-4
                mt-3
                text-sm
                text-[#64748B]
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-1.5
                  "
                >
                  <MapPin size={15} />

                  {job.location}
                </div>

                <div
                  className="
                  flex
                  items-center
                  gap-1.5
                  "
                >
                  <Briefcase size={15} />

                  {job.createdBy?.name}
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-5">
              {/* DESCRIPTION */}
              <div className="mb-5">
                <h3
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  mb-2
                  "
                >
                  Description
                </h3>

                <p
                  className="
                  text-sm
                  leading-7
                  text-[#475569]
                  "
                >
                  {job.description}
                </p>
              </div>

              {/* CONTACT */}
              <div
                className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
                mb-5
                "
              >
                <div
                  className="
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  p-4
                  "
                >
                  <p
                    className="
                    text-xs
                    text-[#64748B]
                    mb-1
                    "
                  >
                    Contact Name
                  </p>

                  <p
                    className="
                    text-sm
                    font-medium
                    text-[#0F172A]
                    "
                  >
                    {job.contactName}
                  </p>
                </div>

                <div
                  className="
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  p-4
                  "
                >
                  <p
                    className="
                    text-xs
                    text-[#64748B]
                    mb-1
                    "
                  >
                    Contact Email
                  </p>

                  <p
                    className="
                    text-sm
                    font-medium
                    text-[#0F172A]
                    "
                  >
                    {job.contactEmail}
                  </p>
                </div>
              </div>

              {/* STATUS UPDATE */}
              {user && user.id === job.createdBy?._id && (
                <div className="mb-5">
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-[#0F172A]
                      mb-2
                      "
                  >
                    Update Status
                  </label>

                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(e.target.value)}
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
                    <option>Open</option>

                    <option>In Progress</option>

                    <option>Closed</option>
                  </select>
                </div>
              )}

              {/* APPLICATIONS */}
              {user && user.id === job.createdBy?._id && (
                <div
                  className="
                    mt-6
                    pt-5
                    border-t
                    border-[#E2E8F0]
                    "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mb-4
                      "
                  >
                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-[#0F172A]
                        "
                    >
                      Applications
                    </h3>

                    <span
                      className="
                        text-sm
                        text-[#64748B]
                        "
                    >
                      {applications.length} received
                    </span>
                  </div>

                  <ApplicationList applications={applications} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <ApplicationModal
          jobId={job._id}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </>
  );
}
