"use client";

import { useEffect, useRef, useState } from "react";

import {
  Briefcase,
  Star,
  Mail,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X,
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
  // SOCKET
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
  // CLOSE OUTSIDE
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
          bg-black/30
          backdrop-blur-sm
          z-[70]
          "
        />
      )}

      {/* PANEL */}

      {open && (
        <div
          className="
          fixed
          inset-0
          z-[80]
          flex
          items-center
          justify-center
          p-3
          sm:p-5
          "
        >
          <div
            ref={panelRef}
            className="
            w-full
            max-w-[1180px]
            h-[92vh]
            bg-white
            rounded-[28px]
            shadow-[0_20px_60px_rgba(15,23,42,0.18)]
            overflow-hidden
            flex
            flex-col
            lg:flex-row
            border
            border-slate-200
            "
          >
            {/* MOBILE HEADER */}

            <div
              className="
              lg:hidden
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-slate-100
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
                  "
                >
                  <Sparkles size={16} />
                </div>

                <div>
                  <h2 className="text-[17px] font-[800] text-slate-900">
                    Applications
                  </h2>

                  <p className="text-[11px] text-slate-500">
                    Submitted proposals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                w-10
                h-10
                rounded-xl
                hover:bg-slate-100
                flex
                items-center
                justify-center
                "
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* LEFT SIDEBAR */}

            <div
              className="
              w-full
              lg:w-[320px]
              border-b
              lg:border-b-0
              lg:border-r
              border-slate-100
              bg-slate-50/70
              flex
              flex-col
              "
            >
              {/* DESKTOP HEADER */}

              <div
                className="
                hidden
                lg:flex
                items-center
                justify-between
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
                    shadow-md
                    "
                  >
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h2 className="text-[19px] font-[800] text-slate-900">
                      Applications
                    </h2>

                    <p className="text-[12px] text-slate-500 mt-1">
                      Submitted proposals
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="
                  w-10
                  h-10
                  rounded-xl
                  hover:bg-slate-100
                  flex
                  items-center
                  justify-center
                  transition-all
                  "
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              {/* APPLICANTS */}

              <div
                className="
                overflow-y-auto
                p-3
                space-y-3
                lg:flex-1
                max-h-[260px]
                lg:max-h-none
                "
              >
                {applications.map((app) => (
                  <button
                    key={app._id}
                    onClick={() => setSelectedApplicant(app)}
                    className={`
                    w-full
                    text-left
                    rounded-3xl
                    p-3
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
                          bg-white/80
                          border-slate-100
                          hover:border-blue-100
                          hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]
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
                          text-[15px]
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

                      <ChevronRight
                        size={16}
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
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* PROFILE SECTION */}

                  <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-start
                    md:justify-between
                    gap-5
                    pb-6
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
                        sm:w-16
                        sm:h-16
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
                        shadow-md
                        shrink-0
                        "
                      >
                        {selectedApplicant?.tradesperson?.name?.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2
                            className="
                            text-[22px]
                            font-[800]
                            tracking-[-0.5px]
                            text-slate-900
                            break-words
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
                          <div
                            className="
                            flex
                            items-center
                            gap-2
                            text-[13px]
                            text-slate-600
                            break-all
                            "
                          >
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
                      w-full
                      md:w-[180px]
                      rounded-3xl
                      bg-gradient-to-br
                      from-blue-50
                      to-indigo-50
                      border
                      border-blue-100
                      p-5
                      "
                    >
                      <div className="text-[32px] font-[900] text-blue-700">
                        £{selectedApplicant?.estimatedPrice}
                      </div>

                      <p className="text-[13px] text-slate-500 mt-2">
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
                      rounded-3xl
                      border
                      border-slate-100
                      bg-slate-50/70
                      p-5
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
                      rounded-3xl
                      border
                      border-slate-100
                      bg-slate-50/70
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
                    flex-col
                    sm:flex-row
                    justify-end
                    gap-3
                    mt-7
                    pt-6
                    border-t
                    border-slate-100
                    "
                  >
                    <button
                      onClick={() => rejectApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-12
                      px-6
                      rounded-2xl
                      bg-red-50
                      hover:bg-red-100
                      border
                      border-red-100
                      text-red-600
                      text-[14px]
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
                      h-12
                      px-6
                      rounded-2xl
                      bg-gradient-to-r
                      from-emerald-500
                      to-green-500
                      hover:scale-[1.02]
                      text-white
                      text-[14px]
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
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Briefcase size={40} className="mx-auto text-slate-300" />

                    <h3 className="mt-4 text-[18px] font-[700] text-slate-700">
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
