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
  // ACCEPT APPLICATION
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
  // REJECT APPLICATION
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
  // SOCKET REALTIME
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
  // CLOSE ON OUTSIDE CLICK
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
            w-[820px]
            h-[88vh]
            mt-6
            rounded-r-[32px]
            bg-white/95
            backdrop-blur-xl
            shadow-[0_12px_40px_rgba(15,23,42,0.15)]
            overflow-hidden
            flex
            border-r
            border
            border-slate-200
            "
          >
            {/* LEFT SIDEBAR */}

            <div
              className="
              w-[250px]
              border-r
              border-slate-100
              bg-slate-50/70
              flex
              flex-col
              "
            >
              {/* HEADER */}

              <div
                className="
                px-5
                py-4
                border-b
                border-slate-100
                bg-white/80
                backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-10
                    h-10
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
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h2 className="text-[17px] font-[800] text-slate-900">
                      Applications
                    </h2>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Submitted proposals
                    </p>
                  </div>
                </div>
              </div>

              {/* APPLICANTS */}

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
                    px-3
                    py-3
                    border
                    transition-all
                    duration-300
                    group

                    ${
                      selectedApplicant?._id === app._id
                        ? `
                          bg-white
                          border-blue-200
                          shadow-[0_4px_20px_rgba(59,130,246,0.12)]
                        `
                        : `
                          bg-white/70
                          border-slate-100
                          hover:border-blue-100
                          hover:shadow-[0_4px_18px_rgba(15,23,42,0.06)]
                        `
                    }
                  `}
                  >
                    <div className="flex items-center gap-3">
                      {/* AVATAR */}

                      <div
                        className="
                        w-10
                        h-10
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-white
                        text-[14px]
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
                          text-[13px]
                          font-[700]
                          tracking-[-0.2px]
                          text-slate-900
                          truncate
                          "
                        >
                          {app.tradesperson?.name}
                        </h3>

                        <p
                          className="
                          text-[11px]
                          font-medium
                          text-slate-500
                          mt-1
                          truncate
                          "
                        >
                          {app.jobTitle}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className="
                        text-slate-400
                        group-hover:text-blue-500
                        transition-all
                        "
                      />
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
                <div className="p-6">
                  {/* PROFILE SECTION */}

                  <div
                    className="
                    flex
                    items-start
                    justify-between
                    gap-5
                    pb-5
                    border-b
                    border-slate-100
                    "
                  >
                    {/* PROFILE */}

                    <div className="flex gap-4">
                      <div
                        className="
                        w-14
                        h-14
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-white
                        text-[20px]
                        font-black
                        flex
                        items-center
                        justify-center
                        shadow-md
                        "
                      >
                        {selectedApplicant?.tradesperson?.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2
                            className="
                            text-[20px]
                            font-[800]
                            tracking-[-0.4px]
                            text-slate-900
                            "
                          >
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

                    {/* PRICE CARD */}

                    <div
                      className="
                      px-4
                      py-3
                      rounded-3xl
                      bg-gradient-to-br
                      from-blue-50
                      to-indigo-50
                      border
                      border-blue-100
                      min-w-[130px]
                      "
                    >
                      <div className="text-[20px] font-[800] text-blue-700">
                        £{selectedApplicant?.estimatedPrice}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        Estimated Budget
                      </p>
                    </div>
                  </div>

                  {/* JOB TITLE */}

                  <div className="mt-5">
                    <h3 className="text-[13px] font-[700] text-slate-500 mb-2">
                      Job Title
                    </h3>

                    <div
                      className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50/70
                      p-4
                      shadow-sm
                      "
                    >
                      <p className="text-[14px] font-semibold text-slate-800">
                        {selectedApplicant?.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* PROPOSAL MESSAGE */}

                  <div className="mt-5">
                    <h3 className="text-[13px] font-[700] text-slate-500 mb-2">
                      Proposal Message
                    </h3>

                    <div
                      className="
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50/70
                      p-4
                      shadow-sm
                      "
                    >
                      <p
                        className="
                        text-[14px]
                        leading-7
                        text-slate-700
                        whitespace-pre-line
                        "
                      >
                        {selectedApplicant?.message}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                    flex
                    justify-end
                    gap-3
                    mt-6
                    pt-5
                    border-t
                    border-slate-100
                    "
                  >
                    <button
                      onClick={() => rejectApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-10
                      px-5
                      rounded-2xl
                      bg-red-50
                      hover:bg-red-100
                      border
                      border-red-100
                      text-red-600
                      text-[13px]
                      font-semibold
                      transition-all
                      duration-300
                      "
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => acceptApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-10
                      px-5
                      rounded-2xl
                      bg-gradient-to-r
                      from-emerald-500
                      to-green-500
                      hover:scale-[1.02]
                      text-white
                      text-[13px]
                      font-semibold
                      shadow-lg
                      shadow-emerald-500/20
                      transition-all
                      duration-300
                      "
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Briefcase size={36} className="mx-auto text-slate-300" />

                    <h3 className="mt-4 text-[17px] font-[700] text-slate-700">
                      No Application Selected
                    </h3>

                    <p className="mt-2 text-[13px] text-slate-500">
                      Select an applicant to view details
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
