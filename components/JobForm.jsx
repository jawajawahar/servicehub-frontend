"use client";

import {
  Briefcase,
  FileText,
  MapPin,
  Mail,
  User2,
  Layers3,
  ArrowRight,
} from "lucide-react";

export default function JobForm({ form, setForm, handleSubmit, loading }) {
  const categories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Joinery",
    "Cleaning",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-[#E2E8F0]
      bg-white
      shadow-[0_10px_40px_rgba(15,23,42,0.06)]
      "
    >
      {/* TOP GLOW */}
      <div
        className="
        absolute
        top-0
        right-0
        w-80
        h-80
        bg-blue-100/40
        blur-3xl
        rounded-full
        pointer-events-none
        "
      />

      {/* CONTENT */}
      <div className="relative p-7">
        {/* HEADER */}
        <div className="mb-8">
          <div
            className="
            flex
            items-center
            gap-4
            mb-4
            "
          >
            {/* ICON */}
            <div
              className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-600
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shadow-[0_12px_30px_rgba(37,99,235,0.20)]
              "
            >
              <Briefcase size={24} />
            </div>

            {/* TEXT */}
            <div>
              <h2
                className="
                text-[28px]
                font-[900]
                tracking-tight
                text-[#0F172A]
                "
              >
                Create New Job
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Post a professional service request
              </p>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="space-y-6">
          {/* TITLE */}
          <div>
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <Briefcase
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Job Title
              </label>

              <span
                className="
                text-red-500
                text-sm
                "
              >
                *
              </span>
            </div>

            {/* INPUT */}
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Need a plumber for kitchen repair..."
              className="
              w-full
              h-12
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              px-5
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

          {/* DESCRIPTION */}
          <div>
            {/* LABEL */}
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <FileText
                size={16}
                className="
                text-[#2563EB]
                "
              />

              <label
                className="
                text-sm
                font-semibold
                text-[#0F172A]
                "
              >
                Description
              </label>

              <span
                className="
                text-red-500
                text-sm
                "
              >
                *
              </span>
            </div>

            {/* TEXTAREA */}
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Describe the issue, requirements, materials, timeline, and any additional details..."
              className="
              w-full
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#FAFBFC]
              px-5
              py-4
              text-sm
              leading-7
              text-[#0F172A]
              placeholder:text-[#94A3B8]
              outline-none
              resize-none
              transition-all
              duration-300
              focus:border-[#2563EB]
              focus:bg-white
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>

          {/* CATEGORY + LOCATION */}
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
            "
          >
            {/* CATEGORY */}
            <div>
              <div
                className="
                flex
                items-center
                gap-2
                mb-3
                "
              >
                <Layers3
                  size={16}
                  className="
                  text-[#2563EB]
                  "
                />

                <label
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Category
                </label>
              </div>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
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
                px-5
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
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <div
                className="
                flex
                items-center
                gap-2
                mb-3
                "
              >
                <MapPin
                  size={16}
                  className="
                  text-[#2563EB]
                  "
                />

                <label
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Location
                </label>
              </div>

              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
                placeholder="Colombo"
                className="
                w-full
                h-12
                rounded-2xl
                border
                border-[#E2E8F0]
                bg-[#FAFBFC]
                px-5
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
          </div>

          {/* CONTACT SECTION */}
          <div
            className="
            rounded-[28px]
            border
            border-[#EEF2F7]
            bg-[#FAFBFC]
            p-5
            "
          >
            {/* SECTION TITLE */}
            <div className="mb-5">
              <h3
                className="
                text-[18px]
                font-[800]
                tracking-tight
                text-[#0F172A]
                "
              >
                Contact Information
              </h3>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Information for communication
              </p>
            </div>

            {/* GRID */}
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
              "
            >
              {/* CONTACT NAME */}
              <div>
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  mb-3
                  "
                >
                  <User2
                    size={16}
                    className="
                    text-[#2563EB]
                    "
                  />

                  <label
                    className="
                    text-sm
                    font-semibold
                    text-[#0F172A]
                    "
                  >
                    Contact Name
                  </label>
                </div>

                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-5
                  text-sm
                  text-[#0F172A]
                  placeholder:text-[#94A3B8]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#2563EB]
                  focus:ring-4
                  focus:ring-blue-100
                  "
                />
              </div>

              {/* CONTACT EMAIL */}
              <div>
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  mb-3
                  "
                >
                  <Mail
                    size={16}
                    className="
                    text-[#2563EB]
                    "
                  />

                  <label
                    className="
                    text-sm
                    font-semibold
                    text-[#0F172A]
                    "
                  >
                    Contact Email
                  </label>
                </div>

                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactEmail: e.target.value,
                    })
                  }
                  placeholder="john@email.com"
                  className="
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-white
                  px-5
                  text-sm
                  text-[#0F172A]
                  placeholder:text-[#94A3B8]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#2563EB]
                  focus:ring-4
                  focus:ring-blue-100
                  "
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="
            flex
            items-center
            justify-end
            gap-3
            pt-2
            "
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="
              h-12
              px-5
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-white
              hover:bg-[#F8FAFC]
              text-sm
              font-semibold
              text-[#0F172A]
              transition-all
              duration-300
              "
            >
              Cancel
            </button>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
              h-12
              px-6
              rounded-2xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              disabled:opacity-50
              text-white
              text-sm
              font-semibold
              shadow-[0_12px_30px_rgba(37,99,235,0.20)]
              flex
              items-center
              gap-2
              transition-all
              duration-300
              "
            >
              {loading ? "Creating..." : "Create Job"}

              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
