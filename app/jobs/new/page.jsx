"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Navbar from "../../../components/Navbar";
import api from "../../../services/api";

import {
  Briefcase,
  FileText,
  User,
  Mail,
  MapPin,
  ImagePlus,
  ArrowRight,
  X,
} from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // =========================================
  // IMAGES
  // =========================================
  const [images, setImages] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  // =========================================
  // FORM
  // =========================================
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  // =========================================
  // CATEGORIES
  // =========================================
  const categories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Cleaning",
    "Joinery",
  ];

  // =========================================
  // HANDLE IMAGES
  // =========================================
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);
  };

  // =========================================
  // REMOVE IMAGE
  // =========================================
  const removeImage = (index) => {
    const updatedImages = [...images];

    updatedImages.splice(index, 1);

    const updatedPreviews = [...imagePreviews];

    updatedPreviews.splice(index, 1);

    setImages(updatedImages);

    setImagePreviews(updatedPreviews);
  };

  // =========================================
  // SUBMIT
  // =========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return toast.error("Title and description are required");
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      submitData.append("title", form.title);

      submitData.append("description", form.description);

      submitData.append("category", form.category);

      submitData.append("location", form.location);

      submitData.append("contactName", form.contactName);

      submitData.append("contactEmail", form.contactEmail);

      // =========================================
      // APPEND IMAGES
      // =========================================
      images.forEach((image) => {
        submitData.append("images", image);
      });

      // =========================================
      // API CALL
      // =========================================
      await api.post("/jobs", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Job created successfully");

      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* PAGE */}
      <div className="min-h-screen bg-[#F8FAFC] pt-[84px] px-4 pb-6">
        <div className="max-w-[980px] mx-auto">
          {/* MAIN CARD */}
          <div className="h-[90vh] overflow-hidden rounded-[24px] bg-[#f8fafc] border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
            {/* SCROLLABLE */}
            <div className="h-full overflow-y-auto p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                {/* ========================================= */}
                {/* JOB DETAILS */}
                {/* ========================================= */}
                <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                  {/* SECTION TITLE */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Briefcase size={18} />
                    </div>

                    <div>
                      <h2 className="text-[22px] font-[700] tracking-tight text-slate-900 ">
                        Job Details
                      </h2>

                      <p className="text-slate-500 text-[13px] mt-1">
                        Describe your service request professionally
                      </p>
                    </div>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* LEFT */}
                    <div className="space-y-4">
                      {/* TITLE */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              title: e.target.value,
                            })
                          }
                          placeholder="Need a plumber for kitchen repair"
                          className="w-full h-11 rounded-xl border border-slate-200 text-black bg-white px-4 text-[14px] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>

                        <textarea
                          rows={4}
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the issue, requirements, timeline and additional details..."
                          className="w-full rounded-xl border border-slate-200 text-black bg-white px-4 py-3 text-[14px] leading-6 outline-none resize-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-4">
                      {/* CATEGORY */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                          Category
                        </label>

                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              category: e.target.value,
                            })
                          }
                          className="w-full h-11 rounded-xl border border-slate-200 text-2xl text-black bg-white px-4 text-[14px] outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select category</option>

                          {categories.map((cat) => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* LOCATION */}
                      <div>
                        <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                          Location
                        </label>

                        <div className="relative">
                          <MapPin
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            value={form.location}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                location: e.target.value,
                              })
                            }
                            placeholder="Colombo, Sri Lanka"
                            className="w-full h-11 rounded-xl border border-slate-200 text-black bg-white pl-10 pr-4 text-[14px] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                  {/* SECTION TITLE */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <User size={18} />
                    </div>

                    <div>
                      <h2 className="text-[22px] font-[700] tracking-tight text-slate-900">
                        Contact Information
                      </h2>

                      <p className="text-slate-500 text-[13px] mt-1">
                        Professionals will contact you using these details
                      </p>
                    </div>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* NAME */}
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                        Contact Name
                      </label>

                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

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
                          className="w-full h-11 rounded-xl border border-slate-200 text-black bg-white pl-10 pr-4 text-[14px] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-2">
                        Contact Email
                      </label>

                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          value={form.contactEmail}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              contactEmail: e.target.value,
                            })
                          }
                          placeholder="john@example.com"
                          className="w-full h-11 rounded-xl border border-slate-200 text-black bg-white pl-10 pr-4 text-[14px] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
                  {/* TITLE */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ImagePlus size={18} />
                    </div>

                    <div>
                      <h2 className="text-[22px] font-[700] tracking-tight text-slate-900">
                        Upload Images
                      </h2>

                      <p className="text-slate-500 text-[13px] mt-1">
                        Add images related to your service request
                      </p>
                    </div>
                  </div>

                  {/* UPLOAD BOX */}
                  <label className="flex flex-col items-center justify-center gap-3 h-[170px] rounded-[22px] border-2 border-dashed border-blue-200 bg-[#f8fbff] hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    <div className="w-12 h-12 rounded-[18px] bg-white shadow-sm flex items-center justify-center text-blue-600">
                      <ImagePlus size={22} />
                    </div>

                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-slate-800">
                        Upload Images
                      </p>

                      <p className="text-[13px] text-slate-500 mt-1">
                        PNG, JPG up to 5 files
                      </p>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImages}
                      className="hidden"
                    />
                  </label>

                  {/* PREVIEW */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                      {imagePreviews.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200"
                        >
                          <img
                            src={image}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />

                          {/* REMOVE */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  {/* CANCEL */}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="h-10 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[14px] font-semibold text-slate-700 transition-all duration-300"
                  >
                    Cancel
                  </button>

                  {/* CREATE */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:scale-[1.02] text-white text-[14px] font-semibold shadow-[0_12px_30px_rgba(59,130,246,0.22)] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Job"}

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
