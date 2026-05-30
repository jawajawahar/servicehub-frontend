"use client";

import { useEffect, useRef, useState } from "react";

import {
  Briefcase,
  Star,
  Mail,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

import socket from "../services/socket";

export default function ApplicationPanel() {
  const [open, setOpen] = useState(false);

  const [applications, setApplications] = useState([]);

  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [loading, setLoading] = useState(false);

  const panelRef = useRef(null);

  // =========================================
  // FETCH APPLICATIONS
  // =========================================

  const fetchApplications = async () => {
    try {
      const res = await api.get("/jobs/my-jobs");

      let allApps = [];

      res.data.forEach((job) => {
        if (job.applications) {
          job.applications.forEach((app) => {
            allApps.push({
              ...app,
              jobTitle: job.title,
            });
          });
        }
      });

      setApplications(allApps);

      if (allApps.length > 0) {
        setSelectedApplicant(allApps[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================
  // ACCEPT
  // =========================================

  const acceptApplication = async (id) => {
    try {
      setLoading(true);

      await api.patch(`/applications/${id}/accept`);

      toast.success("Application accepted");

      window.location.href = `/workspace/${selectedApplicant.job}`;

      fetchApplications();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to accept");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REJECT
  // =========================================

  const rejectApplication = async (id) => {
    try {
      setLoading(true);

      await api.patch(`/applications/${id}/reject`);

      toast.success("Application rejected");

      fetchApplications();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to reject");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, []);

  // =========================================
  // REALTIME SOCKET
  // =========================================

  useEffect(() => {
    socket.on("receiveNotification", (notification) => {
      if (notification.type === "APPLICATION") {
        fetchApplications();

        toast.success(notification.message);
      }
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  // =========================================
  // OUTSIDE CLICK CLOSE
  // =========================================

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="relative">
      {/* TOGGLE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
        relative
        w-11
        h-11
        rounded-2xl
        bg-white
        border
        border-slate-200
        hover:bg-slate-50
        flex
        items-center
        justify-center
        shadow-sm
        transition-all
        duration-300
        "
      >
        <Briefcase size={18} className="text-slate-800" />

        {applications.length > 0 && (
          <div
            className="
            absolute
            -top-1
            -right-1
            min-w-[18px]
            h-[18px]
            px-1
            rounded-full
            bg-blue-600
            text-white
            text-[10px]
            font-bold
            flex
            items-center
            justify-center
            "
          >
            {applications.length}
          </div>
        )}
      </button>

      {/* BACKDROP */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          bg-black/20
          backdrop-blur-[4px]
          z-[70]
          "
        />
      )}

      {/* PANEL */}

      {open && (
        <div
          className="
          fixed
          top-0
          left-0
          h-screen
          z-[80]
          "
        >
          <div
            ref={panelRef}
            className="
            w-[980px]
            h-screen
            bg-white
            shadow-[0_12px_40px_rgba(15,23,42,0.15)]
            overflow-hidden
            flex
            border-r
            border-slate-200
            "
          >
            {/* LEFT SIDEBAR */}

            <div
              className="
              w-[320px]
              border-r
              border-slate-200
              bg-slate-50
              flex
              flex-col
              "
            >
              {/* HEADER */}

              <div
                className="
                p-5
                border-b
                border-slate-200
                bg-white
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    to-indigo-600
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-[800] text-slate-900">
                      Applications
                    </h2>

                    <p className="text-[12px] text-slate-500 mt-1">
                      Submitted proposals
                    </p>
                  </div>
                </div>
              </div>

              {/* APPLICANT LIST */}

              <div
                className="
                flex-1
                overflow-y-auto
                p-3
                space-y-3
                "
              >
                {applications.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => setSelectedApplicant(app)}
                    className={`
                    w-full
                    text-left
                    rounded-2xl
                    p-4
                    border
                    transition-all
                    duration-300

                    ${
                      selectedApplicant?._id === app._id
                        ? `
                          bg-blue-50
                          border-blue-200
                          shadow-sm
                        `
                        : `
                          bg-white
                          border-slate-200
                          hover:border-blue-200
                          hover:shadow-sm
                        `
                    }
                  `}
                  >
                    <div className="flex items-center gap-3">
                      {/* AVATAR */}

                      <div
                        className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-white
                        text-[16px]
                        font-black
                        flex
                        items-center
                        justify-center
                        shrink-0
                        "
                      >
                        {app.tradesperson?.name?.charAt(0)}
                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-0">
                        <h3
                          className="
                          text-[14px]
                          font-[800]
                          text-slate-900
                          truncate
                          "
                        >
                          {app.tradesperson?.name}
                        </h3>

                        <p
                          className="
                          text-[12px]
                          text-slate-500
                          mt-1
                          truncate
                          "
                        >
                          {app.jobTitle}
                        </p>
                      </div>

                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div
              className="
              flex-1
              overflow-y-auto
              bg-white
              "
            >
              {selectedApplicant ? (
                <div className="p-8">
                  {/* TOP SECTION */}

                  <div
                    className="
                    flex
                    items-start
                    justify-between
                    gap-5
                    pb-6
                    border-b
                    border-slate-200
                    "
                  >
                    {/* PROFILE */}

                    <div className="flex gap-4">
                      <div
                        className="
                        w-16
                        h-16
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-white
                        text-[22px]
                        font-black
                        flex
                        items-center
                        justify-center
                        "
                      >
                        {selectedApplicant?.tradesperson?.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[22px] font-[800] text-slate-900">
                            {selectedApplicant?.tradesperson?.name}
                          </h2>

                          {selectedApplicant?.tradesperson?.isVerified && (
                            <div
                              className="
                              h-7
                              px-3
                              rounded-full
                              bg-green-50
                              border
                              border-green-100
                              text-green-700
                              text-[10px]
                              font-bold
                              flex
                              items-center
                              gap-1
                              "
                            >
                              <ShieldCheck size={10} />
                              VERIFIED
                            </div>
                          )}
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-[13px] text-slate-600">
                            <Mail size={13} />

                            {selectedApplicant?.tradesperson?.email}
                          </div>

                          <div className="flex items-center gap-2">
                            <Star
                              size={13}
                              className="text-yellow-500 fill-yellow-500"
                            />

                            <span className="text-[13px] font-semibold text-slate-700">
                              {selectedApplicant?.tradesperson?.averageRating ||
                                0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PRICE */}

                    <div
                      className="
                      px-5
                      py-4
                      rounded-3xl
                      bg-blue-50
                      border
                      border-blue-100
                      "
                    >
                      <div className="text-[24px] font-[800] text-blue-700">
                        £{selectedApplicant?.estimatedPrice}
                      </div>

                      <p className="text-[12px] text-slate-500 mt-1">
                        Estimated Budget
                      </p>
                    </div>
                  </div>

                  {/* JOB TITLE */}

                  <div className="mt-6">
                    <h3 className="text-[14px] font-[700] text-slate-500 mb-2">
                      Job Title
                    </h3>

                    <div
                      className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      text-[15px]
                      font-semibold
                      text-slate-800
                      "
                    >
                      {selectedApplicant?.jobTitle}
                    </div>
                  </div>

                  {/* PROPOSAL */}

                  <div className="mt-6">
                    <h3 className="text-[14px] font-[700] text-slate-500 mb-2">
                      Proposal Message
                    </h3>

                    <div
                      className="
                      rounded-2xl
                      bg-slate-50
                      border
                      border-slate-200
                      p-5
                      "
                    >
                      <p
                        className="
                        text-[15px]
                        leading-8
                        text-slate-700
                        whitespace-pre-line
                        "
                      >
                        {selectedApplicant?.message}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div
                    className="
                    flex
                    justify-end
                    gap-3
                    mt-8
                    pt-6
                    border-t
                    border-slate-200
                    "
                  >
                    <button
                      onClick={() => rejectApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-11
                      px-5
                      rounded-2xl
                      bg-red-50
                      hover:bg-red-100
                      border
                      border-red-100
                      text-red-600
                      text-[14px]
                      font-semibold
                      transition-all
                      "
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => acceptApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-11
                      px-5
                      rounded-2xl
                      bg-emerald-500
                      hover:bg-emerald-600
                      text-white
                      text-[14px]
                      font-semibold
                      transition-all
                      "
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Briefcase size={40} className="mx-auto text-slate-300" />

                    <h3 className="mt-4 text-[18px] font-[700] text-slate-700">
                      No Application Selected
                    </h3>

                    <p className="mt-2 text-[13px] text-slate-500">
                      Select an applicant to view full proposal details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
