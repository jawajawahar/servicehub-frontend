"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import api from "../../../services/api";

import { MapPin, Star, Briefcase, BadgeCheck } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  // ===================================
  // LOAD PROFILE
  // ===================================
  const loadProfile = async () => {
    try {
      const res = await api.get(`/profile/${id}`);

      setProfile(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadProfile();
    }
  }, [id]);

  // ===================================
  // LOADING
  // ===================================
  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F8FAFC]
        "
      >
        <div
          className="
          text-sm
          text-[#64748B]
          "
        >
          Loading profile...
        </div>
      </div>
    );
  }

  // ===================================
  // NOT FOUND
  // ===================================
  if (!profile) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F8FAFC]
        "
      >
        <div
          className="
          text-sm
          text-red-500
          "
        >
          Profile not found
        </div>
      </div>
    );
  }

  const { user, reviews, averageRating, totalReviews, completedJobs } = profile;

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-4
      py-5
      "
    >
      <div
        className="
        max-w-[1180px]
        mx-auto
        "
      >
        {/* TOP SECTION */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-5
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          "
        >
          <div
            className="
            flex
            flex-col
            lg:flex-row
            gap-5
            "
          >
            {/* AVATAR */}
            <div
              className="
              w-20
              h-20
              rounded-2xl
              bg-[#2563EB]
              text-white
              flex
              items-center
              justify-center
              text-2xl
              font-semibold
              shrink-0
              "
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* INFO */}
            <div className="flex-1">
              {/* NAME */}
              <div
                className="
                flex
                items-center
                gap-2
                flex-wrap
                "
              >
                <h1
                  className="
                  text-2xl
                  font-bold
                  text-[#0F172A]
                  tracking-tight
                  "
                >
                  {user.name}
                </h1>

                <BadgeCheck
                  size={18}
                  className="
                  text-blue-600
                  "
                />
              </div>

              {/* LOCATION */}
              <div
                className="
                flex
                items-center
                gap-1.5
                text-sm
                text-[#64748B]
                mt-2
                "
              >
                <MapPin size={14} />

                {user.location || "Location not added"}
              </div>

              {/* BIO */}
              <p
                className="
                text-sm
                leading-7
                text-[#475569]
                mt-4
                max-w-3xl
                "
              >
                {user.bio || "No bio added yet."}
              </p>

              {/* SKILLS */}
              <div
                className="
                flex
                flex-wrap
                gap-2
                mt-4
                "
              >
                {user.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="
                        px-3
                        py-1.5
                        rounded-lg
                        bg-[#EFF6FF]
                        text-[#2563EB]
                        text-xs
                        font-medium
                        "
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span
                    className="
                    text-sm
                    text-[#94A3B8]
                    "
                  >
                    No skills added
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mt-4
          "
        >
          {/* RATING */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-4
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
            "
          >
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <Star
                size={16}
                className="
                text-yellow-400
                fill-yellow-400
                "
              />

              <span
                className="
                text-sm
                font-medium
                text-[#0F172A]
                "
              >
                Rating
              </span>
            </div>

            <h3
              className="
              text-2xl
              font-bold
              text-[#0F172A]
              "
            >
              {averageRating}
            </h3>

            <p
              className="
              text-xs
              text-[#64748B]
              mt-1
              "
            >
              {totalReviews} reviews
            </p>
          </div>

          {/* EXPERIENCE */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-4
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
            "
          >
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
                text-blue-600
                "
              />

              <span
                className="
                text-sm
                font-medium
                text-[#0F172A]
                "
              >
                Experience
              </span>
            </div>

            <h3
              className="
              text-2xl
              font-bold
              text-[#0F172A]
              "
            >
              {user.experience || 0}
            </h3>

            <p
              className="
              text-xs
              text-[#64748B]
              mt-1
              "
            >
              Years experience
            </p>
          </div>

          {/* COMPLETED */}
          <div
            className="
            bg-white
            border
            border-[#E2E8F0]
            rounded-2xl
            p-4
            shadow-[0_2px_8px_rgba(15,23,42,0.03)]
            "
          >
            <div
              className="
              flex
              items-center
              gap-2
              mb-3
              "
            >
              <BadgeCheck
                size={16}
                className="
                text-green-600
                "
              />

              <span
                className="
                text-sm
                font-medium
                text-[#0F172A]
                "
              >
                Completed
              </span>
            </div>

            <h3
              className="
              text-2xl
              font-bold
              text-[#0F172A]
              "
            >
              {completedJobs}
            </h3>

            <p
              className="
              text-xs
              text-[#64748B]
              mt-1
              "
            >
              Jobs completed
            </p>
          </div>
        </div>

        {/* REVIEWS */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-5
          mt-4
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          "
        >
          <h2
            className="
            text-lg
            font-semibold
            text-[#0F172A]
            mb-4
            "
          >
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <div
              className="
              text-sm
              text-[#64748B]
              "
            >
              No reviews yet
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="
                    border
                    border-[#E2E8F0]
                    rounded-xl
                    p-4
                    "
                >
                  {/* TOP */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      mb-2
                      "
                  >
                    <div>
                      <h3
                        className="
                          text-sm
                          font-medium
                          text-[#0F172A]
                          "
                      >
                        {review.reviewer?.name}
                      </h3>

                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          mt-1
                          "
                      >
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="
                                text-yellow-400
                                fill-yellow-400
                                "
                          />
                        ))}
                      </div>
                    </div>

                    <p
                      className="
                        text-xs
                        text-[#94A3B8]
                        shrink-0
                        "
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* COMMENT */}
                  <p
                    className="
                      text-sm
                      leading-6
                      text-[#475569]
                      "
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
