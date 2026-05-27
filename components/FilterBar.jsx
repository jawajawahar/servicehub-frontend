"use client";

import { Search, BriefcaseBusiness, Layers3, CircleDot } from "lucide-react";

export default function FilterBar({ filters, setFilters }) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-[#E2E8F0]
      bg-white
      shadow-[0_8px_30px_rgba(15,23,42,0.05)]
      mb-6
      "
    >
      {/* TOP GLOW */}
      <div
        className="
        absolute
        top-0
        right-0
        w-72
        h-72
        bg-blue-100/40
        blur-3xl
        rounded-full
        pointer-events-none
        "
      />

      {/* CONTENT */}
      <div className="relative p-5">
        {/* HEADER */}
        <div
          className="
          flex
          items-center
          justify-between
          gap-4
          mb-5
          flex-wrap
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
              Filter Jobs
            </h2>

            <p
              className="
              text-sm
              text-[#64748B]
              mt-1
              "
            >
              Search and filter available jobs
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
            Smart Filters
          </div>
        </div>

        {/* FILTER GRID */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          "
        >
          {/* SEARCH */}
          <div className="relative">
            {/* ICON */}
            <Search
              size={17}
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
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
              className="
              w-full
              h-12
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              pl-11
              pr-4
              text-sm
              text-[#0F172A]
              placeholder:text-[#94A3B8]
              outline-none
              transition-all
              duration-300
              focus:border-[#2563EB]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>

          {/* CATEGORY */}
          <div className="relative">
            {/* ICON */}
            <Layers3
              size={17}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#94A3B8]
              pointer-events-none
              "
            />

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                })
              }
              className="
              w-full
              h-12
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              pl-11
              pr-4
              text-sm
              text-[#0F172A]
              outline-none
              appearance-none
              transition-all
              duration-300
              focus:border-[#2563EB]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            >
              <option value="">All Categories</option>

              <option value="Plumbing">Plumbing</option>

              <option value="Electrical">Electrical</option>

              <option value="Painting">Painting</option>

              <option value="Joinery">Joinery</option>

              <option value="Cleaning">Cleaning</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="relative">
            {/* ICON */}
            <CircleDot
              size={17}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#94A3B8]
              pointer-events-none
              "
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                })
              }
              className="
              w-full
              h-12
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              pl-11
              pr-4
              text-sm
              text-[#0F172A]
              outline-none
              appearance-none
              transition-all
              duration-300
              focus:border-[#2563EB]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            >
              <option value="">All Status</option>

              <option value="Open">Open</option>

              <option value="In Progress">In Progress</option>

              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div
          className="
          mt-5
          flex
          items-center
          gap-2
          text-xs
          text-[#94A3B8]
          "
        >
          <BriefcaseBusiness size={14} />
          Use filters to quickly find matching jobs
        </div>
      </div>
    </div>
  );
}
