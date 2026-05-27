"use client";

import { useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  BadgeCheck,
  X,
  Bell,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default function NotificationPanel({ open, applications, onClose }) {
  // VIEW MODES
  const [viewMode, setViewMode] = useState("notifications");

  const [selectedProfile, setSelectedProfile] = useState(null);

  const [profileLoading, setProfileLoading] = useState(false);

  // ACCEPT
  const handleAccept = async (id) => {
    try {
      await api.patch(`/applications/accept/${id}`);

      toast.success("Application accepted");

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Accept failed");
    }
  };

  // REJECT
  const handleReject = async (id) => {
    try {
      await api.patch(`/applications/reject/${id}`);

      toast.success("Application rejected");

      window.location.reload();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Reject failed");
    }
  };

  // OPEN PROFILE
  const openProfile = async (userId) => {
    try {
      setProfileLoading(true);

      const res = await api.get(`/profile/${userId}`);

      setSelectedProfile(res.data);

      setViewMode("profile");
    } catch (error) {
      console.error(error);

      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
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
          z-40
          bg-black/20
          backdrop-blur-[3px]
          "
        />
      )}

      {/* PANEL */}
      <div
        className={`
        fixed
        top-[92px]
        right-4
        mt-2
        w-[95%]
        sm:w-[430px]
        lg:w-[480px]
        max-h-[82vh]
        bg-[#F8FAFC]
        rounded-[32px]
        shadow-[0_30px_90px_rgba(15,23,42,0.18)]
        border
        border-[#E2E8F0]
        overflow-hidden
        z-50
        transition-all
        duration-300
        ${
          open
            ? `
              opacity-100
              translate-y-0
              `
            : `
              opacity-0
              pointer-events-none
              -translate-y-3
              `
        }
        `}
      >
        {/* HEADER */}
        <div
          className="
          sticky
          top-0
          bg-white/95
          backdrop-blur-xl
          border-b
          border-[#E2E8F0]
          px-6
          py-5
          flex
          items-center
          justify-between
          z-20
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
            {/* BACK BUTTON */}
            {viewMode === "profile" && (
              <button
                onClick={() => {
                  setViewMode("notifications");

                  setSelectedProfile(null);
                }}
                className="
                w-10
                h-10
                rounded-2xl
                bg-[#F8FAFC]
                hover:bg-[#EEF2FF]
                border
                border-[#E2E8F0]
                flex
                items-center
                justify-center
                transition-all
                duration-300
                "
              >
                <ArrowLeft size={18} />
              </button>
            )}

            {/* ICON */}
            <div
              className="
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-br
              from-[#2563EB]
              to-[#4F46E5]
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              "
            >
              {viewMode === "notifications" ? (
                <Bell size={20} />
              ) : (
                <BadgeCheck size={20} />
              )}
            </div>

            {/* TITLE */}
            <div>
              <h2
                className="
                text-[22px]
                font-[900]
                tracking-tight
                text-[#0F172A]
                leading-none
                "
              >
                {viewMode === "notifications"
                  ? "Notifications"
                  : `${selectedProfile?.user?.name || ""}`}
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                {viewMode === "notifications"
                  ? "Activity updates"
                  : "Tradesperson profile"}
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
            w-10
            h-10
            rounded-2xl
            bg-[#F8FAFC]
            hover:bg-red-50
            border
            border-[#E2E8F0]
            hover:border-red-100
            text-[#64748B]
            hover:text-red-600
            flex
            items-center
            justify-center
            transition-all
            duration-300
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
          overflow-y-auto
          max-h-[calc(82vh-92px)]
          "
        >
          {/* ================================= */}
          {/* NOTIFICATIONS */}
          {/* ================================= */}

          {viewMode === "notifications" && (
            <div className="p-5 space-y-4">
              {/* EMPTY */}
              {applications.length === 0 ? (
                <div
                  className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  py-24
                  "
                >
                  {/* ICON */}
                  <div
                    className="
                    w-24
                    h-24
                    rounded-[30px]
                    bg-white
                    border
                    border-[#E2E8F0]
                    flex
                    items-center
                    justify-center
                    shadow-sm
                    mb-6
                    "
                  >
                    <Bell
                      size={38}
                      className="
                      text-[#94A3B8]
                      "
                    />
                  </div>

                  <h3
                    className="
                    text-xl
                    font-bold
                    text-[#0F172A]
                    mb-2
                    "
                  >
                    No notifications
                  </h3>

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    max-w-[260px]
                    leading-7
                    "
                  >
                    New proposals and activity updates will appear here.
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="
                      bg-white
                      rounded-[28px]
                      border
                      border-[#E2E8F0]
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-300
                      p-5
                      "
                  >
                    {/* ================================= */}
                    {/* PROPOSAL CARD */}
                    {/* ================================= */}

                    {app.notificationType === "proposal" ? (
                      <>
                        {/* TOP */}
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            mb-5
                            "
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className="
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-[#2563EB]
                                mb-2
                                "
                            >
                              New Proposal
                            </p>

                            <h3
                              className="
                                text-[19px]
                                font-[800]
                                tracking-tight
                                text-[#0F172A]
                                leading-7
                                line-clamp-2
                                "
                            >
                              {app.jobTitle}
                            </h3>
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
                              whitespace-nowrap
                              "
                          >
                            £{app.estimatedPrice}
                          </div>
                        </div>

                        {/* USER */}
                        <div
                          className="
                            flex
                            items-start
                            gap-4
                            mb-5
                            "
                        >
                          {/* AVATAR */}
                          <div
                            className="
                              w-14
                              h-14
                              rounded-[20px]
                              bg-gradient-to-br
                              from-[#2563EB]
                              to-[#4F46E5]
                              text-white
                              flex
                              items-center
                              justify-center
                              text-lg
                              font-bold
                              shrink-0
                              shadow-md
                              "
                          >
                            {app.tradesperson?.name?.charAt(0)?.toUpperCase()}
                          </div>

                          {/* INFO */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="
                                text-[15px]
                                font-bold
                                text-[#0F172A]
                                truncate
                                "
                            >
                              {app.tradesperson?.name}
                            </p>

                            <p
                              className="
                                text-sm
                                text-[#64748B]
                                truncate
                                mt-1
                                "
                            >
                              {app.tradesperson?.email}
                            </p>

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                mt-3
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

                            {/* PROFILE */}
                            <button
                              onClick={() => openProfile(app.tradesperson?._id)}
                              className="
                                mt-4
                                h-10
                                px-4
                                rounded-2xl
                                bg-[#EFF6FF]
                                hover:bg-[#DBEAFE]
                                border
                                border-[#DBEAFE]
                                text-[#2563EB]
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                "
                            >
                              View Profile
                            </button>
                          </div>
                        </div>

                        {/* MESSAGE */}
                        <div
                          className="
                            bg-[#F8FAFC]
                            border
                            border-[#EEF2F7]
                            rounded-2xl
                            p-4
                            mb-5
                            "
                        >
                          <p
                            className="
                              text-sm
                              text-[#475569]
                              leading-7
                              "
                          >
                            {app.message}
                          </p>
                        </div>

                        {/* STATUS */}
                        <div className="mb-5">
                          <span
                            className={`
                              inline-flex
                              items-center
                              px-4
                              py-2
                              rounded-2xl
                              text-xs
                              font-semibold
                              ${
                                app.status === "Accepted"
                                  ? `
                                    bg-emerald-50
                                    text-emerald-700
                                  `
                                  : app.status === "Rejected"
                                    ? `
                                      bg-red-50
                                      text-red-700
                                    `
                                    : `
                                      bg-amber-50
                                      text-amber-700
                                    `
                              }
                              `}
                          >
                            {app.status}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        {app.status === "Pending" && (
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              "
                          >
                            {/* ACCEPT */}
                            <button
                              onClick={() => handleAccept(app._id)}
                              className="
                                flex-1
                                h-11
                                rounded-2xl
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                "
                            >
                              Accept
                            </button>

                            {/* REJECT */}
                            <button
                              onClick={() => handleReject(app._id)}
                              className="
                                flex-1
                                h-11
                                rounded-2xl
                                border
                                border-[#E2E8F0]
                                bg-white
                                hover:bg-[#F8FAFC]
                                text-[#475569]
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                "
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* TRADESPERSON UPDATE */}
                        <div className="mb-5">
                          <p
                            className="
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-wide
                              text-[#2563EB]
                              mb-2
                              "
                          >
                            Application Update
                          </p>

                          <h3
                            className="
                              text-[19px]
                              font-[800]
                              tracking-tight
                              text-[#0F172A]
                              "
                          >
                            {app.jobTitle}
                          </h3>
                        </div>

                        {/* STATUS */}
                        <div className="mb-5">
                          <span
                            className={`
                              inline-flex
                              items-center
                              px-4
                              py-2
                              rounded-2xl
                              text-sm
                              font-semibold
                              ${
                                app.status === "Accepted"
                                  ? `
                                    bg-emerald-50
                                    text-emerald-700
                                  `
                                  : app.status === "Rejected"
                                    ? `
                                      bg-red-50
                                      text-red-700
                                    `
                                    : `
                                      bg-amber-50
                                      text-amber-700
                                    `
                              }
                              `}
                          >
                            {app.status === "Accepted"
                              ? "✅ Accepted"
                              : app.status === "Rejected"
                                ? "❌ Rejected"
                                : "🟡 Pending"}
                          </span>
                        </div>

                        {/* INFO */}
                        <div
                          className="
                            bg-[#F8FAFC]
                            border
                            border-[#EEF2F7]
                            rounded-2xl
                            p-4
                            "
                        >
                          <p
                            className="
                              text-sm
                              text-[#475569]
                              leading-7
                              "
                          >
                            {app.status === "Accepted"
                              ? "Your proposal was accepted by the homeowner."
                              : app.status === "Rejected"
                                ? "Your proposal was rejected."
                                : "Your proposal is waiting for homeowner review."}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ================================= */}
          {/* PROFILE MODE */}
          {/* ================================= */}

          {viewMode === "profile" && (
            <div className="p-5">
              {profileLoading ? (
                <div
                  className="
                  py-24
                  text-center
                  text-[#64748B]
                  "
                >
                  Loading profile...
                </div>
              ) : selectedProfile ? (
                <div>
                  {/* PROFILE CARD */}
                  <div
                    className="
                    relative
                    overflow-hidden
                    bg-white
                    rounded-[32px]
                    border
                    border-[#E2E8F0]
                    shadow-sm
                    p-6
                    mb-6
                    "
                  >
                    {/* TOP LINE */}
                    <div
                      className="
                      absolute
                      top-0
                      left-0
                      w-full
                      h-1.5
                      bg-gradient-to-r
                      from-[#2563EB]
                      via-[#4F46E5]
                      to-[#7C3AED]
                      "
                    />

                    {/* AVATAR */}
                    <div
                      className="
                      w-24
                      h-24
                      rounded-[30px]
                      bg-gradient-to-br
                      from-[#2563EB]
                      to-[#4F46E5]
                      text-white
                      flex
                      items-center
                      justify-center
                      text-3xl
                      font-bold
                      shadow-lg
                      mb-6
                      "
                    >
                      {selectedProfile.user.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* NAME */}
                    <div
                      className="
                      flex
                      items-center
                      gap-2
                      mb-3
                      "
                    >
                      <h2
                        className="
                        text-[28px]
                        font-[900]
                        tracking-tight
                        text-[#0F172A]
                        "
                      >
                        {selectedProfile.user.name}
                      </h2>

                      <BadgeCheck
                        size={24}
                        className="
                        text-[#2563EB]
                        "
                      />
                    </div>

                    {/* BIO */}
                    <p
                      className="
                      text-[#64748B]
                      leading-8
                      mb-6
                      "
                    >
                      {selectedProfile.user.bio || "Professional tradesperson"}
                    </p>

                    {/* INFO */}
                    <div
                      className="
                      flex
                      flex-wrap
                      gap-3
                      mb-6
                      "
                    >
                      <div
                        className="
                        flex
                        items-center
                        gap-2
                        bg-[#F8FAFC]
                        border
                        border-[#E2E8F0]
                        px-4
                        py-3
                        rounded-2xl
                        text-sm
                        text-[#475569]
                        "
                      >
                        <MapPin size={15} />

                        {selectedProfile.user.location || "Location not added"}
                      </div>

                      <div
                        className="
                        flex
                        items-center
                        gap-2
                        bg-[#F8FAFC]
                        border
                        border-[#E2E8F0]
                        px-4
                        py-3
                        rounded-2xl
                        text-sm
                        text-[#475569]
                        "
                      >
                        <Briefcase size={15} />
                        {selectedProfile.user.experience} years experience
                      </div>
                    </div>

                    {/* SKILLS */}
                    <div
                      className="
                      flex
                      flex-wrap
                      gap-3
                      "
                    >
                      {selectedProfile.user.skills?.length > 0 ? (
                        selectedProfile.user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="
                              bg-[#EFF6FF]
                              border
                              border-[#DBEAFE]
                              text-[#2563EB]
                              px-4
                              py-2
                              rounded-2xl
                              text-sm
                              font-medium
                              "
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p
                          className="
                          text-sm
                          text-[#94A3B8]
                          "
                        >
                          No skills added
                        </p>
                      )}
                    </div>
                  </div>

                  {/* STATS */}
                  <div
                    className="
                    grid
                    grid-cols-3
                    gap-3
                    mb-6
                    "
                  >
                    {/* RATING */}
                    <div
                      className="
                      bg-white
                      rounded-[28px]
                      border
                      border-[#E2E8F0]
                      p-5
                      text-center
                      "
                    >
                      <p
                        className="
                        text-xs
                        text-[#94A3B8]
                        mb-2
                        "
                      >
                        Rating
                      </p>

                      <h3
                        className="
                        text-lg
                        font-bold
                        text-[#0F172A]
                        "
                      >
                        ⭐ {selectedProfile.averageRating}
                      </h3>
                    </div>

                    {/* REVIEWS */}
                    <div
                      className="
                      bg-white
                      rounded-[28px]
                      border
                      border-[#E2E8F0]
                      p-5
                      text-center
                      "
                    >
                      <p
                        className="
                        text-xs
                        text-[#94A3B8]
                        mb-2
                        "
                      >
                        Reviews
                      </p>

                      <h3
                        className="
                        text-lg
                        font-bold
                        text-[#0F172A]
                        "
                      >
                        {selectedProfile.totalReviews}
                      </h3>
                    </div>

                    {/* JOBS */}
                    <div
                      className="
                      bg-white
                      rounded-[28px]
                      border
                      border-[#E2E8F0]
                      p-5
                      text-center
                      "
                    >
                      <p
                        className="
                        text-xs
                        text-[#94A3B8]
                        mb-2
                        "
                      >
                        Jobs
                      </p>

                      <h3
                        className="
                        text-lg
                        font-bold
                        text-[#0F172A]
                        "
                      >
                        {selectedProfile.completedJobs}
                      </h3>
                    </div>
                  </div>

                  {/* REVIEWS */}
                  <div className="space-y-4">
                    {selectedProfile.reviews?.length === 0 ? (
                      <div
                        className="
                        bg-white
                        rounded-[28px]
                        border
                        border-[#E2E8F0]
                        p-10
                        text-center
                        text-[#94A3B8]
                        "
                      >
                        No reviews yet
                      </div>
                    ) : (
                      selectedProfile.reviews.map((review) => (
                        <div
                          key={review._id}
                          className="
                            bg-white
                            rounded-[28px]
                            border
                            border-[#E2E8F0]
                            p-5
                            "
                        >
                          {/* TOP */}
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              mb-4
                              "
                          >
                            <div>
                              <p
                                className="
                                  font-semibold
                                  text-[#0F172A]
                                  "
                              >
                                {review.reviewer?.name}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-[#94A3B8]
                                  mt-1
                                  "
                              >
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            {/* STARS */}
                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                "
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={15}
                                  className={
                                    star <= review.rating
                                      ? `
                                            text-yellow-400
                                            fill-yellow-400
                                          `
                                      : `
                                            text-gray-300
                                          `
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          {/* COMMENT */}
                          <p
                            className="
                              text-sm
                              text-[#475569]
                              leading-7
                              "
                          >
                            {review.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
