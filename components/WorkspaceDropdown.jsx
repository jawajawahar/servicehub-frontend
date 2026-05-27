"use client";

import { useEffect, useState, useRef } from "react";

import Link from "next/link";

import {
  Briefcase,
  ChevronDown,
  Circle,
  ArrowRight,
  FolderKanban,
  Clock3,
} from "lucide-react";

import api from "../services/api";

export default function WorkspaceDropdown() {
  const [open, setOpen] = useState(false);

  const [workspaces, setWorkspaces] = useState([]);

  const dropdownRef = useRef(null);

  // =========================
  // FETCH ACTIVE WORKSPACES
  // =========================
  const fetchWorkspaces = async () => {
    try {
      const res = await api.get("/jobs/workspaces");

      setWorkspaces(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspaces();
  }, []);

  // =========================
  // OUTSIDE CLICK CLOSE
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* =================================== */}
      {/* BUTTON */}
      {/* =================================== */}

      <button
        onClick={() => setOpen(!open)}
        className={`
        h-12
        px-5
        rounded-2xl
        border
        flex
        items-center
        gap-3
        transition-all
        duration-300

        ${
          open
            ? `
              border-[#CBD5E1]
              bg-white
              shadow-lg
            `
            : `
              border-transparent
              hover:bg-white
              hover:border-[#E2E8F0]
            `
        }
        `}
      >
        {/* ICON */}
        <div
          className="
          w-8
          h-8
          rounded-xl
          bg-[#0F172A]
          text-white
          flex
          items-center
          justify-center
          "
        >
          <Briefcase size={16} />
        </div>

        {/* TEXT */}
        <div className="text-left">
          <p
            className="
            text-sm
            font-bold
            text-[#0F172A]
            leading-none
            "
          >
            Workspaces
          </p>

          <p
            className="
            text-[11px]
            text-[#64748B]
            mt-1
            "
          >
            Active projects
          </p>
        </div>

        {/* ARROW */}
        <ChevronDown
          size={16}
          className={`
          text-[#64748B]
          transition-transform
          duration-300

          ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* =================================== */}
      {/* DROPDOWN */}
      {/* =================================== */}

      {open && (
        <div
          className="
          absolute
          top-[62px]
          left-0
          w-[420px]
          rounded-[32px]
          border
          border-[#E2E8F0]
          bg-white
          shadow-[0_30px_80px_rgba(15,23,42,0.14)]
          overflow-hidden
          z-[999]
          "
        >
          {/* =================================== */}
          {/* HEADER */}
          {/* =================================== */}

          <div
            className="
            relative
            overflow-hidden
            px-6
            py-6
            border-b
            border-[#EEF2F7]
            bg-[#FAFBFC]
            "
          >
            {/* GLOW */}
            <div
              className="
              absolute
              top-0
              right-0
              w-48
              h-48
              bg-blue-100/40
              blur-3xl
              rounded-full
              "
            />

            <div className="relative">
              <div
                className="
                flex
                items-center
                gap-4
                "
              >
                {/* ICON */}
                <div
                  className="
                  w-14
                  h-14
                  rounded-[22px]
                  bg-[#0F172A]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  "
                >
                  <FolderKanban size={24} />
                </div>

                {/* TEXT */}
                <div>
                  <h2
                    className="
                    text-[24px]
                    font-[900]
                    tracking-tight
                    text-[#0F172A]
                    "
                  >
                    Workspaces
                  </h2>

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    mt-1
                    "
                  >
                    Continue active service projects
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* LIST */}
          {/* =================================== */}

          <div
            className="
            max-h-[480px]
            overflow-y-auto
            "
          >
            {workspaces.length === 0 ? (
              <div
                className="
                py-20
                px-8
                text-center
                "
              >
                {/* ICON */}
                <div
                  className="
                  w-20
                  h-20
                  rounded-[28px]
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-6
                  "
                >
                  <Briefcase
                    size={34}
                    className="
                    text-[#94A3B8]
                    "
                  />
                </div>

                {/* TEXT */}
                <h3
                  className="
                  text-lg
                  font-bold
                  text-[#0F172A]
                  "
                >
                  No Active Workspaces
                </h3>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-3
                  leading-7
                  "
                >
                  Your active projects and workspaces will appear here.
                </p>
              </div>
            ) : (
              <div className="p-3">
                {workspaces.map((job) => (
                  <Link
                    key={job._id}
                    href={`/workspace/${job._id}`}
                    className="
                      group
                      block
                      rounded-[28px]
                      border
                      border-transparent
                      p-5
                      hover:bg-[#FAFBFC]
                      hover:border-[#E2E8F0]
                      transition-all
                      duration-300
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
                        {/* TITLE */}
                        <h3
                          className="
                            text-[16px]
                            font-[800]
                            tracking-tight
                            text-[#0F172A]
                            leading-6
                            "
                        >
                          {job.title}
                        </h3>

                        {/* DESC */}
                        <p
                          className="
                            text-sm
                            leading-7
                            text-[#64748B]
                            mt-3
                            line-clamp-2
                            "
                        >
                          {job.description}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          h-8
                          rounded-full
                          bg-emerald-50
                          border
                          border-emerald-100
                          text-emerald-700
                          text-xs
                          font-bold
                          shrink-0
                          "
                      >
                        <Circle
                          size={9}
                          className="
                            fill-emerald-500
                            "
                        />
                        Active
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mt-5
                        pt-4
                        border-t
                        border-[#EEF2F7]
                        "
                    >
                      {/* STATUS */}
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-xs
                          text-[#64748B]
                          "
                      >
                        <Clock3 size={13} />

                        {job.status}
                      </div>

                      {/* OPEN */}
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-bold
                          text-[#2563EB]
                          group-hover:translate-x-1
                          transition-transform
                          duration-300
                          "
                      >
                        Open Workspace
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
