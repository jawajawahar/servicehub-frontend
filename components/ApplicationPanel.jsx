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
      document.body.style.overflow = "hidden";

      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = "auto";

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

      {/* FULL PAGE BLUR */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          z-[70]
          bg-white/8
          backdrop-blur-[10px]
          "
        />
      )}

      {/* PANEL */}

      {open && (
        <div
          className="
          fixed
          top-[88px]
          left-[18px]
          right-[18px]
          z-[80]
          flex
          justify-center
          "
        >
          <div
            ref={panelRef}
            className="
            w-full
            max-w-[1120px]
            h-[80vh]
            rounded-[30px]
            bg-white/92
            backdrop-blur-2xl
            shadow-[0_30px_80px_rgba(15,23,42,0.18)]
            overflow-hidden
            flex
            border
            border-white/50
            "
          >
            {/* LEFT SIDE */}

            <div
              className="
              w-[250px]
              border-r
              border-slate-100
              bg-white/55
              backdrop-blur-xl
              flex
              flex-col
              "
            >
              {/* HEADER */}

              <div
                className="
                px-5
                py-5
                border-b
                border-slate-100
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
                    shadow-lg
                    "
                  >
                    <Sparkles size={16} />
                  </div>

                  <div>
                    <h2 className="text-[18px] font-[800] text-slate-900">
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
                    rounded-[24px]
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
                          shadow-[0_8px_24px_rgba(59,130,246,0.12)]
                        `
                        : `
                          bg-white/75
                          border-slate-100
                          hover:border-blue-100
                          hover:shadow-[0_6px_20px_rgba(15,23,42,0.05)]
                        `
                    }
                  `}
                  >
                    <div className="flex items-center gap-3">
                      {/* AVATAR */}

                      <div
                        className="
                        w-11
                        h-11
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-white
                        text-[15px]
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
                          text-slate-900
                          truncate
                          "
                        >
                          {app.tradesperson?.name}
                        </h3>

                        <p
                          className="
                          text-[11px]
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
              bg-white/45
              backdrop-blur-xl
              "
            >
              {selectedApplicant && (
                <div className="p-6 sm:p-7">
                  {/* TOP */}

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
                        shadow-lg
                        "
                      >
                        {selectedApplicant?.tradesperson?.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2
                            className="
                            text-[22px]
                            font-[800]
                            tracking-[-0.5px]
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

                    {/* SMALL PRICE CARD */}

                    <div
                      className="
                      px-5
                      py-4
                      rounded-[24px]
                      bg-gradient-to-br
                      from-blue-50
                      to-indigo-50
                      border
                      border-blue-100
                      shadow-sm
                      min-w-[150px]
                      "
                    >
                      <div className="text-[28px] font-[900] text-blue-700">
                        £{selectedApplicant?.estimatedPrice}
                      </div>

                      <p className="text-[12px] text-slate-500 mt-1">
                        Estimated Budget
                      </p>
                    </div>
                  </div>

                  {/* JOB TITLE */}

                  <div className="mt-6">
                    <h3 className="text-[14px] font-[700] text-slate-700 mb-3">
                      Job Title
                    </h3>

                    <div
                      className="
                      rounded-[22px]
                      border
                      border-slate-100
                      bg-white/80
                      p-4
                      shadow-sm
                      "
                    >
                      <p className="text-[15px] font-semibold text-slate-800">
                        {selectedApplicant?.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* PROPOSAL */}

                  <div className="mt-6">
                    <h3 className="text-[14px] font-[700] text-slate-700 mb-3">
                      Proposal Message
                    </h3>

                    <div
                      className="
                      rounded-[22px]
                      border
                      border-slate-100
                      bg-white/80
                      p-5
                      shadow-sm
                      "
                    >
                      <p
                        className="
                        text-[14px]
                        leading-8
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
                    gap-4
                    mt-7
                    pt-5
                    border-t
                    border-slate-100
                    "
                  >
                    {/* REJECT */}

                    <button
                      onClick={() => rejectApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-11
                      px-7
                      rounded-2xl
                      bg-white
                      border
                      border-red-100
                      hover:border-red-200
                      hover:bg-red-50
                      text-red-500
                      text-[14px]
                      font-[700]
                      shadow-sm
                      transition-all
                      duration-300
                      "
                    >
                      Reject
                    </button>

                    {/* ACCEPT */}

                    <button
                      onClick={() => acceptApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-11
                      px-7
                      rounded-2xl
                      bg-gradient-to-r
                      from-emerald-500
                      to-green-500
                      hover:scale-[1.03]
                      text-white
                      text-[14px]
                      font-[700]
                      shadow-[0_12px_24px_rgba(16,185,129,0.28)]
                      transition-all
                      duration-300
                      "
                    >
                      Accept
                    </button>
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
