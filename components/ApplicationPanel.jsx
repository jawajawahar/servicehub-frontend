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
      {/* ========================================= */}
      {/* TOGGLE BUTTON */}
      {/* ========================================= */}

      <button
        onClick={() => setOpen(!open)}
        className="
        relative
        w-11
        h-11
        rounded-2xl
        bg-white
        border
        border-[#E2E8F0]
        hover:bg-[#F8FAFC]
        flex
        items-center
        justify-center
        transition-all
        duration-300
        shadow-sm
        z-[60]
        "
      >
        <Briefcase
          size={19}
          className="
          text-[#0F172A]
          "
        />

        {/* BADGE */}
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
            bg-[#2563EB]
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

      {/* ========================================= */}
      {/* BACKDROP */}
      {/* ========================================= */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          bg-black/20
          backdrop-blur-[3px]
          z-[70]
          transition-all
          duration-300
          "
        />
      )}

      {/* ========================================= */}
      {/* PANEL */}
      {/* ========================================= */}

      {open && (
        <div
          className="
          fixed
          top-[92px]
          right-6
          z-[80]
          "
        >
          <div
            ref={panelRef}
            className="
            w-[1100px]
            h-[680px]
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            shadow-[0_20px_80px_rgba(15,23,42,0.18)]
            overflow-hidden
            flex
            "
          >
            {/* ========================================= */}
            {/* LEFT SIDE */}
            {/* ========================================= */}

            <div
              className="
              w-[320px]
              border-r
              border-[#EEF2F7]
              bg-[#FBFCFD]
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
                border-[#EEF2F7]
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >
                  <div
                    className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-[#2563EB]
                    text-white
                    flex
                    items-center
                    justify-center
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <h2
                      className="
                      text-[20px]
                      font-[800]
                      tracking-tight
                      text-[#0F172A]
                      "
                    >
                      Applications
                    </h2>

                    <p
                      className="
                      text-sm
                      text-[#64748B]
                      mt-0.5
                      "
                    >
                      Incoming proposals
                    </p>
                  </div>
                </div>

                {/* STATS */}
                <div
                  className="
                  flex
                  items-center
                  gap-3
                  mt-5
                  "
                >
                  <div
                    className="
                    h-10
                    px-4
                    rounded-2xl
                    bg-white
                    border
                    border-[#E2E8F0]
                    flex
                    items-center
                    text-sm
                    font-semibold
                    text-[#0F172A]
                    "
                  >
                    {applications.length} Applications
                  </div>

                  <div
                    className="
                    h-10
                    px-4
                    rounded-2xl
                    bg-green-50
                    border
                    border-green-100
                    text-green-700
                    text-sm
                    font-semibold
                    flex
                    items-center
                    "
                  >
                    Live
                  </div>
                </div>
              </div>

              {/* LIST */}
              <div
                className="
                flex-1
                overflow-y-auto
                p-3
                space-y-3
                "
              >
                {applications.length === 0 ? (
                  <div
                    className="
                    h-full
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    px-6
                    "
                  >
                    <div
                      className="
                      w-16
                      h-16
                      rounded-3xl
                      bg-white
                      border
                      border-[#E2E8F0]
                      flex
                      items-center
                      justify-center
                      mb-5
                      "
                    >
                      <Briefcase
                        size={26}
                        className="
                        text-[#94A3B8]
                        "
                      />
                    </div>

                    <h3
                      className="
                      text-sm
                      font-semibold
                      text-[#0F172A]
                      "
                    >
                      No Applications Yet
                    </h3>

                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mt-2
                      leading-6
                      "
                    >
                      Incoming proposals will appear here
                    </p>
                  </div>
                ) : (
                  applications.map((app) => (
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
                              bg-[#F8FBFF]
                              border-[#BFDBFE]
                            `
                            : `
                              bg-white
                              border-[#EEF2F7]
                              hover:border-[#DBEAFE]
                            `
                        }
                        `}
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                          "
                      >
                        {/* LEFT */}
                        <div
                          className="
                            flex
                            gap-3
                            min-w-0
                            "
                        >
                          <div
                            className="
                              w-12
                              h-12
                              rounded-2xl
                              bg-gradient-to-br
                              from-blue-600
                              to-indigo-600
                              text-white
                              text-lg
                              font-black
                              flex
                              items-center
                              justify-center
                              shrink-0
                              "
                          >
                            {app.tradesperson?.name?.charAt(0)}
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="
                                text-[15px]
                                font-[800]
                                tracking-tight
                                text-[#0F172A]
                                truncate
                                "
                            >
                              {app.tradesperson?.name}
                            </h3>

                            <p
                              className="
                                text-sm
                                text-[#64748B]
                                mt-1
                                line-clamp-1
                                "
                            >
                              {app.jobTitle}
                            </p>

                            <div
                              className="
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-[#94A3B8]
                                mt-3
                                "
                            >
                              <Clock3 size={12} />
                              Recently submitted
                            </div>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div
                          className="
                            shrink-0
                            px-3
                            py-1.5
                            rounded-xl
                            bg-white
                            border
                            border-[#DBEAFE]
                            text-[#2563EB]
                            text-xs
                            font-bold
                            "
                        >
                          £{app.estimatedPrice}
                        </div>
                      </div>

                      {/* MESSAGE */}
                      <p
                        className="
                          text-sm
                          text-[#64748B]
                          leading-6
                          mt-4
                          line-clamp-2
                          "
                      >
                        {app.message}
                      </p>

                      {/* FOOTER */}
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mt-4
                          pt-4
                          border-t
                          border-[#F1F5F9]
                          "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                            "
                        >
                          <Star
                            size={13}
                            className="
                              text-yellow-500
                              fill-yellow-500
                              "
                          />

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-[#475569]
                              "
                          >
                            {app.tradesperson?.averageRating || 0}
                          </span>
                        </div>

                        <ChevronRight
                          size={15}
                          className="
                            text-[#94A3B8]
                            "
                        />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ========================================= */}
            {/* RIGHT SIDE */}
            {/* ========================================= */}

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
                    pb-5
                    border-b
                    border-[#EEF2F7]
                    "
                  >
                    <div
                      className="
                      flex
                      items-start
                      justify-between
                      gap-5
                      "
                    >
                      {/* LEFT */}
                      <div
                        className="
                        flex
                        items-start
                        gap-4
                        "
                      >
                        <div
                          className="
                          w-16
                          h-16
                          rounded-3xl
                          bg-gradient-to-br
                          from-blue-600
                          to-indigo-600
                          text-white
                          text-2xl
                          font-black
                          flex
                          items-center
                          justify-center
                          "
                        >
                          {selectedApplicant.tradesperson?.name?.charAt(0)}
                        </div>

                        <div>
                          <div
                            className="
                            flex
                            items-center
                            gap-2
                            flex-wrap
                            "
                          >
                            <h2
                              className="
                              text-[22px]
                              font-[800]
                              tracking-tight
                              text-[#0F172A]
                              "
                            >
                              {selectedApplicant.tradesperson?.name}
                            </h2>

                            {selectedApplicant.tradesperson?.isVerified && (
                              <div
                                className="
                                h-8
                                px-3
                                rounded-full
                                bg-green-50
                                border
                                border-green-100
                                text-green-700
                                text-[11px]
                                font-bold
                                flex
                                items-center
                                gap-1.5
                                "
                              >
                                <ShieldCheck size={12} />
                                VERIFIED
                              </div>
                            )}
                          </div>

                          <div
                            className="
                            flex
                            flex-wrap
                            items-center
                            gap-5
                            mt-4
                            "
                          >
                            <div
                              className="
                              flex
                              items-center
                              gap-2
                              text-sm
                              text-[#64748B]
                              "
                            >
                              <Mail size={14} />

                              {selectedApplicant.tradesperson?.email}
                            </div>

                            <div
                              className="
                              flex
                              items-center
                              gap-1.5
                              "
                            >
                              <Star
                                size={13}
                                className="
                                text-yellow-500
                                fill-yellow-500
                                "
                              />

                              <span
                                className="
                                text-sm
                                font-semibold
                                text-[#475569]
                                "
                              >
                                {selectedApplicant.tradesperson
                                  ?.averageRating || 0}
                              </span>
                            </div>

                            <div
                              className="
                              text-sm
                              text-[#64748B]
                              "
                            >
                              {selectedApplicant.tradesperson?.completedJobs ||
                                0}{" "}
                              completed jobs
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div
                        className="
                        px-5
                        py-4
                        rounded-2xl
                        bg-[#F8FBFF]
                        border
                        border-[#DBEAFE]
                        "
                      >
                        <div
                          className="
                          text-[24px]
                          font-[800]
                          tracking-tight
                          text-[#2563EB]
                          "
                        >
                          £{selectedApplicant.estimatedPrice}
                        </div>

                        <p
                          className="
                          text-xs
                          text-[#64748B]
                          mt-1
                          "
                        >
                          Estimated Budget
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PROPOSAL */}
                  <div className="mt-5">
                    <div
                      className="
                      rounded-2xl
                      bg-[#FAFBFC]
                      p-5
                      "
                    >
                      <h3
                        className="
                        text-[16px]
                        font-[700]
                        text-[#0F172A]
                        mb-3
                        "
                      >
                        Proposal Message
                      </h3>

                      <p
                        className="
                        text-[15px]
                        leading-8
                        text-[#475569]
                        "
                      >
                        {selectedApplicant.message}
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
                    border-[#EEF2F7]
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
                      text-sm
                      font-semibold
                      flex
                      items-center
                      gap-2
                      transition-all
                      duration-300
                      "
                    >
                      <X size={15} />
                      Reject
                    </button>

                    <button
                      onClick={() => acceptApplication(selectedApplicant._id)}
                      disabled={loading}
                      className="
                      h-11
                      px-5
                      rounded-2xl
                      bg-[#16A34A]
                      hover:bg-[#15803D]
                      text-white
                      text-sm
                      font-semibold
                      flex
                      items-center
                      gap-2
                      transition-all
                      duration-300
                      "
                    >
                      <Check size={15} />
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
