"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { ImagePlus, X } from "lucide-react";

import Navbar from "../../../components/Navbar";

import JobForm from "../../../components/JobForm";

import api from "../../../services/api";

export default function NewJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // IMAGES
  const [images, setImages] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  // FORM
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  // ===================================
  // HANDLE IMAGES
  // ===================================
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);
  };

  // ===================================
  // REMOVE IMAGE
  // ===================================
  const removeImage = (index) => {
    const updatedImages = [...images];

    updatedImages.splice(index, 1);

    const updatedPreviews = [...imagePreviews];

    updatedPreviews.splice(index, 1);

    setImages(updatedImages);

    setImagePreviews(updatedPreviews);
  };

  // ===================================
  // SUBMIT
  // ===================================
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

      // IMAGES
      images.forEach((image) => {
        submitData.append("images", image);
      });

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

      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        pt-[84px]
        px-4
        pb-6
        "
      >
        <div
          className="
          max-w-[900px]
          mx-auto
          "
        >
          {/* CARD */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            shadow-[0_2px_10px_rgba(15,23,42,0.03)]
            overflow-hidden
            "
          >
            {/* HEADER */}
            <div
              className="
              px-5
              py-4
              border-b
              border-[#E2E8F0]
              "
            >
              <h1
                className="
                text-[24px]
                font-bold
                tracking-tight
                text-[#0F172A]
                "
              >
                Create Job
              </h1>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Post a new service request
              </p>
            </div>

            {/* BODY */}
            <div className="p-5">
              {/* FORM */}
              <JobForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                loading={loading}
              />

              {/* IMAGE SECTION */}
              <div className="mt-5">
                <label
                  className="
                  block
                  text-sm
                  font-medium
                  text-[#0F172A]
                  mb-2
                  "
                >
                  Images
                </label>

                {/* UPLOAD */}
                <label
                  className="
                  border
                  border-dashed
                  border-[#CBD5E1]
                  hover:border-[#2563EB]
                  rounded-xl
                  px-4
                  py-5
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  cursor-pointer
                  transition-all
                  bg-[#F8FAFC]
                  hover:bg-[#EFF6FF]
                  "
                >
                  <div
                    className="
                    w-10
                    h-10
                    rounded-xl
                    bg-white
                    border
                    border-[#E2E8F0]
                    flex
                    items-center
                    justify-center
                    text-[#2563EB]
                    "
                  >
                    <ImagePlus size={18} />
                  </div>

                  <div className="text-center">
                    <h3
                      className="
                      text-sm
                      font-medium
                      text-[#0F172A]
                      "
                    >
                      Upload Images
                    </h3>

                    <p
                      className="
                      text-xs
                      text-[#64748B]
                      mt-1
                      "
                    >
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
                  <div
                    className="
                    grid
                    grid-cols-3
                    sm:grid-cols-4
                    gap-3
                    mt-4
                    "
                  >
                    {imagePreviews.map((image, index) => (
                      <div
                        key={index}
                        className="
                          relative
                          aspect-square
                          rounded-xl
                          overflow-hidden
                          border
                          border-[#E2E8F0]
                          "
                      >
                        <img
                          src={image}
                          alt="preview"
                          className="
                            w-full
                            h-full
                            object-cover
                            "
                        />

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="
                            absolute
                            top-1.5
                            right-1.5
                            w-6
                            h-6
                            rounded-full
                            bg-black/60
                            hover:bg-red-500
                            text-white
                            flex
                            items-center
                            justify-center
                            transition-all
                            "
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div
                className="
                flex
                items-center
                justify-end
                gap-3
                mt-6
                pt-5
                border-t
                border-[#E2E8F0]
                "
              >
                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="
                  h-10
                  px-4
                  rounded-xl
                  border
                  border-[#E2E8F0]
                  hover:bg-[#F8FAFC]
                  text-[#475569]
                  text-sm
                  font-medium
                  transition-all
                  "
                >
                  Cancel
                </button>

                {/* SUBMIT */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="
                  h-10
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
                  {loading ? "Creating..." : "Create Job"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
