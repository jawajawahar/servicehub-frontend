"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  Search,
  ShieldCheck,
  ShieldX,
  Ban,
  CheckCircle2,
  Star,
} from "lucide-react";

import api from "../../../services/api";

import AdminLayout from "../../../components/AdminLayout";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  // ===================================
  // FETCH USERS
  // ===================================
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      setUsers(res.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  // ===================================
  // VERIFY USER
  // ===================================
  const verifyUser = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/verify`);

      toast.success("User verified");

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Verification failed");
    }
  };

  // ===================================
  // BLOCK USER
  // ===================================
  const blockUser = async (id, blocked) => {
    try {
      await api.patch(`/admin/users/${id}/block`, {
        isBlocked: !blocked,
      });

      toast.success(blocked ? "User unblocked" : "User blocked");

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Action failed");
    }
  };

  // ===================================
  // FILTER USERS
  // ===================================
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "All" || user.role === roleFilter.toLowerCase();

    return matchSearch && matchRole;
  });

  return (
    <AdminLayout>
      <div
        className="
        min-h-screen
        bg-[#F8FAFC]
        p-5
        lg:p-6
        "
      >
        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}
        <div className="mb-5">
          <h1
            className="
            text-[28px]
            font-bold
            tracking-tight
            text-[#0F172A]
            "
          >
            User Management
          </h1>

          <p
            className="
            text-sm
            text-[#64748B]
            mt-1
            "
          >
            Manage platform users and moderation
          </p>
        </div>

        {/* =================================== */}
        {/* FILTER BAR */}
        {/* =================================== */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          p-4
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          mb-4
          "
        >
          <div
            className="
            flex
            flex-col
            lg:flex-row
            gap-3
            "
          >
            {/* SEARCH */}
            <div
              className="
              flex-1
              relative
              "
            >
              <Search
                size={16}
                className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#94A3B8]
                "
              />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full
                h-10
                pl-10
                pr-3
                rounded-xl
                border
                border-[#E2E8F0]
                bg-white
                text-sm
                text-[#0F172A]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                "
              />
            </div>

            {/* FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="
              h-10
              px-3
              rounded-xl
              border
              border-[#E2E8F0]
              bg-white
              text-sm
              text-[#0F172A]
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
            >
              <option>All</option>

              <option>Homeowner</option>

              <option>Tradesperson</option>

              <option>Admin</option>
            </select>
          </div>
        </div>

        {/* =================================== */}
        {/* TABLE */}
        {/* =================================== */}
        <div
          className="
          bg-white
          border
          border-[#E2E8F0]
          rounded-2xl
          shadow-[0_2px_8px_rgba(15,23,42,0.03)]
          overflow-hidden
          "
        >
          {/* TABLE HEADER */}
          <div
            className="
            grid
            grid-cols-[2fr_120px_120px_120px_120px]
            gap-4
            px-5
            py-3
            border-b
            border-[#E2E8F0]
            bg-[#F8FAFC]
            text-[11px]
            font-semibold
            uppercase
            tracking-wide
            text-[#64748B]
            "
          >
            <div>User</div>

            <div>Role</div>

            <div>Rating</div>

            <div>Status</div>

            <div>Actions</div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div
              className="
              py-20
              flex
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
          ) : filteredUsers.length === 0 ? (
            <div
              className="
              py-20
              text-center
              "
            >
              <div className="text-4xl mb-3">👤</div>

              <p
                className="
                text-sm
                text-[#64748B]
                "
              >
                No users found
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="
                  grid
                  grid-cols-[2fr_120px_120px_120px_120px]
                  gap-4
                  px-5
                  py-3
                  border-b
                  border-[#F1F5F9]
                  items-center
                  hover:bg-[#FAFBFC]
                  transition-all
                  "
              >
                {/* USER */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-w-0
                    "
                >
                  {/* AVATAR */}
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-[#2563EB]
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-semibold
                      shrink-0
                      "
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0">
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        "
                    >
                      <h3
                        className="
                          text-sm
                          font-medium
                          text-[#0F172A]
                          truncate
                          "
                      >
                        {user.name}
                      </h3>

                      {user.isVerified && (
                        <CheckCircle2
                          size={14}
                          className="
                            text-green-600
                            shrink-0
                            "
                        />
                      )}
                    </div>

                    <p
                      className="
                        text-xs
                        text-[#64748B]
                        truncate
                        mt-0.5
                        "
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* ROLE */}
                <div>
                  <span
                    className="
                      px-2.5
                      py-1
                      rounded-lg
                      bg-[#EFF6FF]
                      text-[#2563EB]
                      text-xs
                      font-medium
                      capitalize
                      "
                  >
                    {user.role}
                  </span>
                </div>

                {/* RATING */}
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    "
                >
                  <Star
                    size={13}
                    className="
                      text-yellow-500
                      fill-yellow-500
                      "
                  />

                  <span
                    className="
                      text-sm
                      font-medium
                      text-[#0F172A]
                      "
                  >
                    {user.averageRating || 0}
                  </span>
                </div>

                {/* STATUS */}
                <div>
                  {user.isBlocked ? (
                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-lg
                        bg-red-50
                        text-red-600
                        text-xs
                        font-medium
                        "
                    >
                      Blocked
                    </span>
                  ) : (
                    <span
                      className="
                        px-2.5
                        py-1
                        rounded-lg
                        bg-green-50
                        text-green-600
                        text-xs
                        font-medium
                        "
                    >
                      Active
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    "
                >
                  {/* VERIFY */}
                  {!user.isVerified && (
                    <button
                      onClick={() => verifyUser(user._id)}
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-green-50
                        hover:bg-green-100
                        text-green-600
                        flex
                        items-center
                        justify-center
                        transition-all
                        "
                    >
                      <ShieldCheck size={15} />
                    </button>
                  )}

                  {/* BLOCK */}
                  <button
                    onClick={() => blockUser(user._id, user.isBlocked)}
                    className={`
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      transition-all

                      ${
                        user.isBlocked
                          ? `
                            bg-blue-50
                            hover:bg-blue-100
                            text-blue-600
                          `
                          : `
                            bg-red-50
                            hover:bg-red-100
                            text-red-600
                          `
                      }
                      `}
                  >
                    {user.isBlocked ? <ShieldX size={15} /> : <Ban size={15} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
