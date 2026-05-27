"use client";

import { useEffect, useRef, useState } from "react";

import { Bell, CheckCheck, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

import socket from "../services/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);

  const [unread, setUnread] = useState(0);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // FETCH UNREAD COUNT
  // =========================
  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications/unread-count");

      setUnread(res.data.unread);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      fetchNotifications();

      fetchUnread();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // MARK ALL READ
  // =========================
  const markAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");

      fetchNotifications();

      fetchUnread();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      fetchNotifications();

      fetchUnread();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    fetchUnread();
  }, []);

  // =========================
  // REALTIME SOCKET
  // =========================
  useEffect(() => {
    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);

      setUnread((prev) => prev + 1);

      toast.success(notification.message);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  // =========================
  // OUTSIDE CLICK CLOSE
  // =========================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        className="
        relative
        w-11
        h-11
        rounded-2xl
        bg-white
        border
        border-[#E2E8F0]
        shadow-sm
        hover:bg-[#F8FAFC]
        hover:shadow-md
        transition-all
        duration-300
        flex
        items-center
        justify-center
        "
      >
        <Bell
          size={19}
          className="
          text-[#475569]
          "
        />

        {/* BADGE */}
        {unread > 0 && (
          <div
            className="
            absolute
            -top-1
            -right-1
            min-w-[20px]
            h-5
            px-1.5
            rounded-full
            bg-red-500
            text-white
            text-[10px]
            font-bold
            flex
            items-center
            justify-center
            shadow-lg
            "
          >
            {unread}
          </div>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
          absolute
          top-14
          right-0
          w-[390px]
          rounded-[30px]
          border
          border-[#E2E8F0]
          bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.16)]
          overflow-hidden
          z-[999]
          animate-in
          fade-in
          slide-in-from-top-2
          duration-300
          "
        >
          {/* HEADER */}
          <div
            className="
            px-6
            py-5
            border-b
            border-[#EEF2F7]
            bg-[#FAFBFC]
            flex
            items-center
            justify-between
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
                Notifications
              </h2>

              <p
                className="
                text-sm
                text-[#64748B]
                mt-1
                "
              >
                Real-time updates
              </p>
            </div>

            {/* MARK ALL */}
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="
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
                flex
                items-center
                gap-2
                transition-all
                duration-300
                "
              >
                <CheckCheck size={15} />
                Mark all
              </button>
            )}
          </div>

          {/* LIST */}
          <div
            className="
            max-h-[500px]
            overflow-y-auto
            "
          >
            {notifications.length === 0 ? (
              <div
                className="
                py-20
                px-6
                text-center
                "
              >
                {/* ICON */}
                <div
                  className="
                  w-20
                  h-20
                  mx-auto
                  rounded-[28px]
                  bg-[#F8FAFC]
                  border
                  border-[#E2E8F0]
                  flex
                  items-center
                  justify-center
                  mb-5
                  "
                >
                  <Bell
                    size={32}
                    className="
                    text-[#94A3B8]
                    "
                  />
                </div>

                <h3
                  className="
                  text-lg
                  font-bold
                  text-[#0F172A]
                  "
                >
                  No Notifications
                </h3>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-2
                  leading-7
                  "
                >
                  New activity and updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`
                    relative
                    px-5
                    py-5
                    border-b
                    border-[#F1F5F9]
                    hover:bg-[#FAFBFC]
                    transition-all
                    duration-300

                    ${
                      !item.isRead
                        ? `
                          bg-[#EFF6FF]/40
                        `
                        : ""
                    }
                    `}
                >
                  {/* UNREAD DOT */}
                  {!item.isRead && (
                    <div
                      className="
                        absolute
                        top-6
                        left-2
                        w-2
                        h-2
                        rounded-full
                        bg-[#2563EB]
                        "
                    />
                  )}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      "
                  >
                    {/* LEFT */}
                    <div className="flex-1">
                      <p
                        className="
                          text-[14px]
                          leading-7
                          text-[#334155]
                          "
                      >
                        {item.message}
                      </p>

                      <p
                        className="
                          text-[11px]
                          text-[#94A3B8]
                          mt-3
                          "
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        shrink-0
                        "
                    >
                      {/* READ */}
                      {!item.isRead && (
                        <button
                          onClick={() => markAsRead(item._id)}
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-[#EFF6FF]
                            hover:bg-[#DBEAFE]
                            text-[#2563EB]
                            flex
                            items-center
                            justify-center
                            transition-all
                            duration-300
                            "
                        >
                          <CheckCheck size={15} />
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        onClick={() => deleteNotification(item._id)}
                        className="
                          w-9
                          h-9
                          rounded-xl
                          bg-red-50
                          hover:bg-red-100
                          text-red-500
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-300
                          "
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
