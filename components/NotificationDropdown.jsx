"use client";

import { useEffect, useRef, useState } from "react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import { Bell, Briefcase, CheckCircle2, Clock3 } from "lucide-react";

export default function NotificationDropdown() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ===================================
  // FETCH APPLICATIONS
  // ===================================
  const fetchNotifications = async () => {
    try {
      const jobsRes = await api.get("/jobs");

      const myJobs = jobsRes.data.filter(
        (job) => job.createdBy?._id === user.id,
      );

      let allApplications = [];

      for (const job of myJobs) {
        const res = await api.get(`/applications/${job._id}`);

        const mapped = res.data.map((app) => ({
          ...app,
          jobTitle: job.title,
        }));

        allApplications = [...allApplications, ...mapped];
      }

      setApplications(allApplications);
    } catch (error) {
      console.error(error);
    }
  };

  // ===================================
  // INITIAL LOAD
  // ===================================
  useEffect(() => {
    if (user && user.role === "homeowner") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNotifications();
    }
  }, [user]);

  // ===================================
  // OUTSIDE CLICK CLOSE
  // ===================================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // ===================================
  // ONLY HOMEOWNER
  // ===================================
  if (!user || user.role !== "homeowner") {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* =================================== */}
      {/* BUTTON */}
      {/* =================================== */}
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
          shadow-sm
          hover:bg-[#F8FAFC]
          hover:shadow-md
          transition-all
          duration-300
          flex
          items-center
          justify-center
          "
      >
        <Bell
          size={18}
          className="
            text-[#475569]
            "
        />

        {/* BADGE */}
        {applications.length > 0 && (
          <div
            className="
              absolute
              -top-1
              -right-1
              min-w-[20px]
              h-5
              px-1.5
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
              shadow-lg
              "
          >
            {applications.length}
          </div>
        )}
      </button>

      {/* =================================== */}
      {/* DROPDOWN */}
      {/* =================================== */}
      {open && (
        <div
          className="
            fixed
            top-[88px]
            right-6
            w-[400px]
            bg-white
            border
            border-[#E2E8F0]
            rounded-[30px]
            shadow-[0_25px_80px_rgba(15,23,42,0.16)]
            overflow-hidden
            z-[999]
            animate-in
            fade-in
            slide-in-from-top-2
            duration-300
            "
        >
          {/* HEADER */}
          <div
            className="
              px-6
              py-5
              border-b
              border-[#EEF2F7]
              bg-[#FAFBFC]
              "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                "
            >
              {/* LEFT */}
              <div>
                <h2
                  className="
                    text-[20px]
                    font-[800]
                    tracking-tight
                    text-[#0F172A]
                    "
                >
                  Notifications
                </h2>

                <p
                  className="
                    text-sm
                    text-[#64748B]
                    mt-1
                    "
                >
                  New applications and updates
                </p>
              </div>

              {/* BADGE */}
              <div
                className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-[#EFF6FF]
                  border
                  border-[#DBEAFE]
                  text-[#2563EB]
                  text-sm
                  font-semibold
                  "
              >
                {applications.length} New
              </div>
            </div>
          </div>

          {/* LIST */}
          <div
            className="
              max-h-[520px]
              overflow-y-auto
              "
          >
            {applications.length === 0 ? (
              <div
                className="
                  py-20
                  px-6
                  text-center
                  "
              >
                {/* ICON */}
                <div
                  className="
                    w-20
                    h-20
                    mx-auto
                    rounded-[28px]
                    bg-[#F8FAFC]
                    border
                    border-[#E2E8F0]
                    flex
                    items-center
                    justify-center
                    mb-5
                    "
                >
                  <Bell
                    size={32}
                    className="
                      text-[#94A3B8]
                      "
                  />
                </div>

                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#0F172A]
                    "
                >
                  No Notifications
                </h3>

                <p
                  className="
                    text-sm
                    text-[#64748B]
                    mt-2
                    leading-7
                    "
                >
                  New job applications will appear here.
                </p>
              </div>
            ) : (
              <div className="p-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="
                        group
                        rounded-[24px]
                        border
                        border-[#EEF2F7]
                        bg-white
                        p-5
                        hover:bg-[#FAFBFC]
                        hover:border-[#DBEAFE]
                        transition-all
                        duration-300
                        mb-3
                        "
                  >
                    {/* TOP */}
                    <div
                      className="
                          flex
                          items-start
                          justify-between
                          gap-4
                          "
                    >
                      {/* LEFT */}
                      <div className="flex-1">
                        {/* LABEL */}
                        <div
                          className="
                              flex
                              items-center
                              gap-2
                              mb-3
                              "
                        >
                          <div
                            className="
                                w-9
                                h-9
                                rounded-2xl
                                bg-[#EFF6FF]
                                text-[#2563EB]
                                flex
                                items-center
                                justify-center
                                "
                          >
                            <Briefcase size={16} />
                          </div>

                          <div>
                            <p
                              className="
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-wide
                                  text-[#2563EB]
                                  "
                            >
                              New Proposal
                            </p>

                            <p
                              className="
                                  text-xs
                                  text-[#94A3B8]
                                  mt-1
                                  "
                            >
                              Job application
                            </p>
                          </div>
                        </div>

                        {/* TITLE */}
                        <h3
                          className="
                              text-[16px]
                              font-[800]
                              tracking-tight
                              text-[#0F172A]
                              leading-7
                              "
                        >
                          {app.jobTitle}
                        </h3>

                        {/* USER */}
                        <div
                          className="
                              flex
                              items-center
                              justify-between
                              mt-4
                              "
                        >
                          <div>
                            <p
                              className="
                                  text-sm
                                  font-semibold
                                  text-[#2563EB]
                                  "
                            >
                              {app.tradesperson?.name}
                            </p>

                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                  mt-2
                                  "
                            >
                              <Clock3
                                size={13}
                                className="
                                    text-[#94A3B8]
                                    "
                              />

                              <span
                                className="
                                    text-xs
                                    text-[#94A3B8]
                                    "
                              >
                                Recently submitted
                              </span>
                            </div>
                          </div>

                          {/* PRICE */}
                          <div
                            className="
                                px-4
                                py-2
                                rounded-2xl
                                bg-emerald-50
                                border
                                border-emerald-100
                                text-emerald-700
                                text-sm
                                font-bold
                                "
                          >
                            £{app.estimatedPrice}
                          </div>
                        </div>

                        {/* MESSAGE */}
                        <div
                          className="
                              mt-4
                              rounded-2xl
                              bg-[#F8FAFC]
                              border
                              border-[#EEF2F7]
                              p-4
                              "
                        >
                          <p
                            className="
                                text-sm
                                text-[#475569]
                                leading-7
                                line-clamp-2
                                "
                          >
                            {app.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div
                      className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          "
                    >
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-emerald-600
                            text-xs
                            font-semibold
                            "
                      >
                        <CheckCircle2 size={13} />
                        Proposal Received
                      </div>

                      <button
                        className="
                            h-9
                            px-4
                            rounded-xl
                            bg-[#0F172A]
                            hover:bg-[#111827]
                            text-white
                            text-sm
                            font-semibold
                            transition-all
                            duration-300
                            "
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
