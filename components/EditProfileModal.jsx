"use client";

import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import {
  X,
  Briefcase,
  MapPin,
  Sparkles,
  User2,
  Award,
  Loader2,
} from "lucide-react";

export default function EditProfileModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experience: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  // ===================================
  // LOAD PROFILE
  // ===================================
  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/me");

      setFormData({
        bio: res.data.bio || "",

        skills: res.data.skills?.join(", ") || "",

        experience: res.data.experience || "",

        location: res.data.location || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  // ===================================
  // HANDLE CHANGE
  // ===================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===================================
  // SUBMIT
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/profile", {
        ...formData,

        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      toast.success("Profile updated");

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={onClose}
          className="
          fixed
          inset-0
          z-[100]
          bg-black/30
          backdrop-blur-sm
          animate-in
          fade-in
          duration-200
          "
        />
      )}

      {/* MODAL */}
      <div
        className={`
        fixed
        left-1/2
        top-1/2
        z-[101]
        w-[95%]
        sm:w-[620px]
        max-h-[90vh]
        overflow-y-auto
        -translate-x-1/2
        -translate-y-1/2
        rounded-[30px]
        bg-white
        border
        border-[#E2E8F0]
        shadow-[0_30px_80px_rgba(15,23,42,0.18)]
        transition-all
        duration-300

        ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
        `}
      >
        {/* TOP BAR */}
        <div
          className="
          h-1.5
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600
          "
        />

        {/* CONTENT */}
        <div className="p-7">
          {/* HEADER */}
          <div
            className="
            flex
            items-start
            justify-between
            gap-4
            mb-8
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
                shadow-[0_12px_30px_rgba(37,99,235,0.22)]
                shrink-0
                "
              >
                <Sparkles size={22} />
              </div>

              {/* TEXT */}
              <div>
                <h2
                  className="
                  text-[28px]
                  leading-none
                  font-[800]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Edit Profile
                </h2>

                <p
                  className="
                  mt-2
                  text-sm
                  text-[#64748B]
                  "
                >
                  Update your professional information
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
              w-10
              h-10
              rounded-xl
              hover:bg-[#F8FAFC]
              text-[#64748B]
              flex
              items-center
              justify-center
              transition-all
              "
            >
              <X size={18} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* BIO */}
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
                  Professional Bio
                </label>
              </div>

              <textarea
                name="bio"
                rows={5}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell homeowners about your experience and expertise..."
                className="
                w-full
                rounded-2xl
                border
                border-[#E2E8F0]
                bg-[#FAFBFC]
                px-5
                py-4
                outline-none
                resize-none
                text-[15px]
                leading-8
                text-[#0F172A]
                placeholder:text-[#94A3B8]
                transition-all
                duration-300
                focus:border-[#2563EB]
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* SKILLS */}
            <div>
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
                  Skills
                </label>
              </div>

              <div className="relative">
                <Briefcase
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
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Plumbing, Wiring, Painting"
                  className="
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-[#FAFBFC]
                  pl-12
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

              <p
                className="
                text-xs
                text-[#94A3B8]
                mt-2
                "
              >
                Separate skills using commas
              </p>
            </div>

            {/* GRID */}
            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-5
              "
            >
              {/* EXPERIENCE */}
              <div>
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  mb-3
                  "
                >
                  <Award
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
                    Experience
                  </label>
                </div>

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="5"
                  className="
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-[#E2E8F0]
                  bg-[#FAFBFC]
                  px-4
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

                <div className="relative">
                  <MapPin
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
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Colombo"
                    className="
                    w-full
                    h-12
                    rounded-2xl
                    border
                    border-[#E2E8F0]
                    bg-[#FAFBFC]
                    pl-12
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
              </div>
            </div>

            {/* ACTIONS */}
            <div
              className="
              flex
              items-center
              gap-3
              pt-3
              "
            >
              {/* CANCEL */}
              <button
                type="button"
                onClick={onClose}
                className="
                flex-1
                h-12
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

              {/* SAVE */}
              <button
                type="submit"
                disabled={loading}
                className="
                flex-1
                h-12
                rounded-2xl
                bg-[#2563EB]
                hover:bg-[#1D4ED8]
                text-white
                text-sm
                font-semibold
                shadow-[0_12px_30px_rgba(37,99,235,0.20)]
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
