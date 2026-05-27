"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { ArrowLeft, Pencil } from "lucide-react";

import Navbar from "../../../../components/Navbar";

import JobForm from "../../../../components/JobForm";

import api from "../../../../services/api";

export default function EditJobPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  // ===================================
  // FETCH JOB
  // ===================================
  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      setForm({
        title: res.data.title || "",

        description: res.data.description || "",

        category: res.data.category || "",

        location: res.data.location || "",

        contactName: res.data.contactName || "",

        contactEmail: res.data.contactEmail || "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to load job");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchJob();
    }
  }, [id]);

  // ===================================
  // UPDATE JOB
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/jobs/${id}`, form);

      toast.success("Job updated successfully");

      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // LOADING
  // ===================================
  if (fetching) {
    return (
      <>
        <Navbar />

        <div
          className="
          min-h-screen
          bg-[#F8FAFC]
          flex
          items-center
          justify-center
          "
        >
          <div
            className="
            w-10
            h-10
            rounded-full
            border-[3px]
            border-blue-100
            border-t-blue-600
            animate-spin
            "
          />
        </div>
      </>
    );
  }

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
          {/* TOP BAR */}
          <div
            className="
            flex
            items-center
            justify-between
            mb-4
            "
          >
            {/* LEFT */}
            <div
              className="
              flex
              items-center
              gap-3
              "
            >
              <button
                onClick={() => router.push("/")}
                className="
                w-9
                h-9
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                hover:bg-[#F8FAFC]
                flex
                items-center
                justify-center
                transition-all
                "
              >
                <ArrowLeft
                  size={16}
                  className="
                  text-[#475569]
                  "
                />
              </button>

              <div>
                <h1
                  className="
                  text-[24px]
                  font-bold
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Edit Job
                </h1>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-1
                  "
                >
                  Update your service request details
                </p>
              </div>
            </div>
          </div>

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
              flex
              items-center
              gap-3
              px-5
              py-4
              border-b
              border-[#E2E8F0]
              "
            >
              <div
                className="
                w-9
                h-9
                rounded-xl
                bg-[#EFF6FF]
                text-[#2563EB]
                flex
                items-center
                justify-center
                "
              >
                <Pencil size={16} />
              </div>

              <div>
                <h2
                  className="
                  text-sm
                  font-semibold
                  text-[#0F172A]
                  "
                >
                  Job Information
                </h2>

                <p
                  className="
                  text-xs
                  text-[#64748B]
                  mt-0.5
                  "
                >
                  Edit the fields below
                </p>
              </div>
            </div>

            {/* BODY */}
            <div className="p-5">
              <JobForm
                form={form}
                setForm={setForm}
                handleSubmit={handleSubmit}
                loading={loading}
              />

              {/* ACTIONS */}
              <div
                className="
                flex
                items-center
                justify-end
                gap-3
                mt-5
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
                  bg-white
                  hover:bg-[#F8FAFC]
                  text-[#475569]
                  text-sm
                  font-medium
                  transition-all
                  "
                >
                  Cancel
                </button>

                {/* SAVE */}
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
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
