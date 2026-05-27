"use client";

import { useEffect, useState } from "react";

import { MapPin, Briefcase, User2, Wrench } from "lucide-react";

import api from "../../../services/api";

import toast from "react-hot-toast";

export default function EditProfilePage() {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

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
    } catch (error) {
      console.error(error);

      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-4
      py-8
      "
    >
      <div
        className="
        max-w-2xl
        mx-auto
        "
      >
        {/* HEADER */}
        <div className="mb-6">
          <h1
            className="
            text-[28px]
            font-bold
            tracking-tight
            text-[#0F172A]
            "
          >
            Edit Profile
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-2
            "
          >
            Manage your professional information and public profile.
          </p>
        </div>

        {/* CARD */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-6
          shadow-[0_2px_10px_rgba(15,23,42,0.03)]
          "
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BIO */}
            <div>
              <label
                className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                <User2 size={15} />
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell homeowners about your experience and expertise..."
                className="
                w-full
                border
                border-[#E2E8F0]
                rounded-xl
                px-4
                py-3
                text-sm
                leading-7
                text-[#0F172A]
                bg-white
                outline-none
                resize-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* SKILLS */}
            <div>
              <label
                className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                <Wrench size={15} />
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Plumbing, Wiring, Painting"
                className="
                w-full
                h-11
                border
                border-[#E2E8F0]
                rounded-xl
                px-4
                text-sm
                text-[#0F172A]
                bg-white
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />

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

            {/* EXPERIENCE */}
            <div>
              <label
                className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                <Briefcase size={15} />
                Years of Experience
              </label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                className="
                w-full
                h-11
                border
                border-[#E2E8F0]
                rounded-xl
                px-4
                text-sm
                text-[#0F172A]
                bg-white
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* LOCATION */}
            <div>
              <label
                className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#0F172A]
                mb-2
                "
              >
                <MapPin size={15} />
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Colombo"
                className="
                w-full
                h-11
                border
                border-[#E2E8F0]
                rounded-xl
                px-4
                text-sm
                text-[#0F172A]
                bg-white
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                h-11
                px-5
                rounded-xl
                bg-[#2563EB]
                hover:bg-[#1D4ED8]
                disabled:opacity-70
                text-white
                text-sm
                font-medium
                transition-all
                "
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
