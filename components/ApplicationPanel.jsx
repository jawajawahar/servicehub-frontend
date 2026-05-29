"use client";

import { useEffect, useRef, useState } from "react";

import {
  Briefcase,
  Check,
  X,
  Star,
  Mail,
  Sparkles,
  Clock3,
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
  // INITIAL
  // =========================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
  }, []);

  // =========================================
  // REALTIME
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
        top-[90px]
        right-6
        z-[80]
        "
        >
          <div
            ref={panelRef}
            className="
          w-[920px]
          h-[620px]
          rounded-[28px]
          border
          border-slate-200
          bg-white
          shadow-[0_12px_40px_rgba(15,23,42,0.12)]
          overflow-hidden
          flex
          "
          >
            {/* LEFT SIDE */}

            <div
              className="
            w-[280px]
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
                    <h2
                      className="
                    text-[17px]
                    font-[800]
                    text-slate-900
                    "
                    >
                      Applications
                    </h2>

                    <p
                      className="
                    text-[12px]
                    text-slate-500
                    mt-0.5
                    "
                    >
                      Incoming proposals
                    </p>
                  </div>
                </div>
              </div>

              {/* LIST */}

              <div
                className="
              flex-1
              overflow-y-auto
              p-3
              space-y-2
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
                  p-3
                  border
                  transition-all
                  duration-300

                  ${
                    selectedApplicant?._id === app._id
                      ? `
                        bg-blue-50
                        border-blue-200
                      `
                      : `
                        bg-white
                        border-slate-200
                        hover:border-blue-200
                      `
                  }
                `}
                  >
                    <div className="flex gap-3">
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

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">
                        <h3
                          className="
                        text-[13px]
                        font-[800]
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

                        <p
                          className="
                        text-[11px]
                        text-slate-500
                        leading-5
                        mt-2
                        line-clamp-2
                        "
                        >
                          {app.message}
                        </p>
                      </div>
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
              {selectedApplicant && (
                <div className="p-5">
                  {/* PROFILE */}

                  <div
                    className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  pb-5
                  border-b
                  border-slate-200
                  "
                  >
                    {/* LEFT */}

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
                      "
                      >
                        {selectedApplicant?.tradesperson?.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2
                            className="
                          text-[18px]
                          font-[800]
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

                        <div
                          className="
                        flex
                        items-center
                        gap-4
                        mt-3
                        flex-wrap
                        "
                        >
                          <div
                            className="
                          flex
                          items-center
                          gap-2
                          text-[12px]
                          text-slate-500
                          "
                          >
                            <Mail size={12} />

                            {selectedApplicant?.tradesperson?.email}
                          </div>

                          <div className="flex items-center gap-1">
                            <Star
                              size={11}
                              className="
                            text-yellow-500
                            fill-yellow-500
                            "
                            />

                            <span
                              className="
                            text-[12px]
                            font-semibold
                            text-slate-700
                            "
                            >
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
                    px-4
                    py-3
                    rounded-2xl
                    bg-blue-50
                    border
                    border-blue-100
                    "
                    >
                      <div
                        className="
                      text-[20px]
                      font-[800]
                      text-blue-700
                      "
                      >
                        £{selectedApplicant?.estimatedPrice}
                      </div>

                      <p
                        className="
                      text-[11px]
                      text-slate-500
                      mt-1
                      "
                      >
                        Estimated Budget
                      </p>
                    </div>
                  </div>

                  {/* PROPOSAL */}

                  <div className="mt-5">
                    <div
                      className="
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-200
                    p-4
                    "
                    >
                      <h3
                        className="
                      text-[14px]
                      font-[700]
                      text-slate-900
                      mb-3
                      "
                      >
                        Proposal Message
                      </h3>

                      <p
                        className="
                      text-[14px]
                      leading-7
                      text-slate-600
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
                  border-slate-200
                  "
                  >
                    <button
                      onClick={() => rejectApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                    h-10
                    px-4
                    rounded-xl
                    bg-red-50
                    hover:bg-red-100
                    border
                    border-red-100
                    text-red-600
                    text-[13px]
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
                    h-10
                    px-4
                    rounded-xl
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    text-[13px]
                    font-semibold
                    transition-all
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
