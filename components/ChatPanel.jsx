"use client";

import { useEffect, useRef, useState } from "react";

import { SendHorizontal, MoreVertical, Phone, ShieldCheck } from "lucide-react";

import socket from "../services/socket";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function ChatPanel({
  open = true,
  onClose,
  jobId,
  workspaceMode = false,
}) {
  const { user } = useAuth();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [mounted, setMounted] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typing, setTyping] = useState("");

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  // =========================
  // LOAD MESSAGES
  // =========================
  const loadMessages = async () => {
    try {
      const res = await api.get(`/messages/${jobId}`);

      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // MOUNT FIX
  // =========================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // =========================
  // SOCKET EVENTS
  // =========================
  useEffect(() => {
    if (!jobId || !user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();

    socket.emit("joinRoom", jobId);

    socket.emit("userOnline", user.id);

    // RECEIVE
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    // ONLINE
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    // TYPING
    const handleTyping = (data) => {
      setTyping(`${data.user} is typing...`);
    };

    // STOP TYPING
    const handleStopTyping = () => {
      setTyping("");
    };

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("onlineUsers", handleOnlineUsers);

    socket.on("typing", handleTyping);

    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);

      socket.off("onlineUsers", handleOnlineUsers);

      socket.off("typing", handleTyping);

      socket.off("stopTyping");
    };
  }, [jobId, user]);

  // =========================
  // HANDLE TYPING
  // =========================
  const handleTypingInput = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      jobId,

      user: user?.name || "User",
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        jobId,
      });
    }, 1000);
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const messageData = {
        sender: user.id,

        job: jobId,

        text: message,
      };

      const res = await api.post("/messages", messageData);

      socket.emit("sendMessage", res.data);

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // SAFETY
  // =========================
  if (!mounted) return null;

  if (!user) return null;

  return (
    <>
      {/* MOBILE BACKDROP */}
      {!workspaceMode && open && (
        <div
          onClick={onClose}
          className="
          fixed
          inset-0
          bg-black/30
          backdrop-blur-sm
          z-40
          lg:hidden
          "
        />
      )}

      {/* PANEL */}
      <div
        className={`
        ${
          workspaceMode
            ? `
              h-full
              flex
              flex-col
              bg-[#F8FAFC]
            `
            : `
              fixed
              top-[78px]
              left-0
              h-[calc(100vh-78px)]
              w-full
              sm:w-[400px]
              bg-[#F8FAFC]
              border-r
              border-[#E2E8F0]
              shadow-[0_10px_40px_rgba(15,23,42,0.08)]
              z-50
              flex
              flex-col
              transition-transform
              duration-300
              ${open ? "translate-x-0" : "-translate-x-full"}
            `
        }
        `}
      >
        {/* HEADER */}
        <div
          className="
          h-[74px]
          px-5
          border-b
          border-[#EEF2F7]
          bg-white/90
          backdrop-blur-xl
          flex
          items-center
          justify-between
          shrink-0
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
            {/* AVATAR */}
            <div
              className="
              relative
              w-11
              h-11
              rounded-2xl
              bg-gradient-to-br
              from-blue-600
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-sm
              shadow-[0_10px_25px_rgba(37,99,235,0.20)]
              "
            >
              {user?.name?.charAt(0)?.toUpperCase()}

              {/* ONLINE DOT */}
              <div
                className={`
                absolute
                -bottom-0.5
                -right-0.5
                w-3.5
                h-3.5
                rounded-full
                border-2
                border-white

                ${
                  onlineUsers.includes(user.id) ? "bg-green-500" : "bg-gray-400"
                }
                `}
              />
            </div>

            {/* INFO */}
            <div>
              <div
                className="
                flex
                items-center
                gap-2
                "
              >
                <h2
                  className="
                  text-[15px]
                  font-[700]
                  text-[#0F172A]
                  "
                >
                  Workspace Chat
                </h2>

                <ShieldCheck
                  size={14}
                  className="
                  text-blue-600
                  "
                />
              </div>

              <p
                className="
                text-xs
                text-[#64748B]
                mt-1
                "
              >
                {onlineUsers.includes(user.id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          {!workspaceMode && (
            <div
              className="
              flex
              items-center
              gap-1
              "
            >
              <button
                className="
                w-9
                h-9
                rounded-xl
                hover:bg-[#F1F5F9]
                text-[#64748B]
                flex
                items-center
                justify-center
                transition-all
                "
              >
                <Phone size={16} />
              </button>

              <button
                className="
                w-9
                h-9
                rounded-xl
                hover:bg-[#F1F5F9]
                text-[#64748B]
                flex
                items-center
                justify-center
                transition-all
                "
              >
                <MoreVertical size={16} />
              </button>

              <button
                onClick={onClose}
                className="
                w-9
                h-9
                rounded-xl
                hover:bg-red-50
                hover:text-red-600
                text-[#64748B]
                flex
                items-center
                justify-center
                transition-all
                "
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <div
          className="
          flex-1
          overflow-y-auto
          px-4
          py-5
          bg-gradient-to-br
          from-[#F8FAFC]
          to-white
          space-y-3
          "
        >
          {messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender?._id : msg.sender;

            const isMine = senderId === user.id;

            return (
              <div
                key={msg._id}
                className={`
                flex
                ${isMine ? "justify-end" : "justify-start"}
                `}
              >
                <div
                  className={`
                  max-w-[78%]
                  px-4
                  py-3
                  rounded-2xl

                  ${
                    isMine
                      ? `
                        bg-[#2563EB]
                        text-white
                        rounded-br-md
                        shadow-[0_10px_25px_rgba(37,99,235,0.18)]
                      `
                      : `
                        bg-white
                        text-[#0F172A]
                        rounded-bl-md
                        border
                        border-[#E2E8F0]
                        shadow-sm
                      `
                  }
                  `}
                >
                  <p
                    className="
                    text-[14px]
                    leading-7
                    break-words
                    "
                  >
                    {msg.text}
                  </p>

                  <div
                    className="
                    flex
                    justify-end
                    mt-1.5
                    "
                  >
                    <p
                      className={`
                      text-[10px]

                      ${isMine ? "text-blue-100" : "text-[#94A3B8]"}
                      `}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",

                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* TYPING */}
          {typing && (
            <div className="flex justify-start">
              <div
                className="
                bg-white
                border
                border-[#E2E8F0]
                px-4
                py-2
                rounded-2xl
                shadow-sm
                "
              >
                <p
                  className="
                  text-xs
                  italic
                  text-[#64748B]
                  "
                >
                  {typing}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div
          className="
          p-4
          border-t
          border-[#EEF2F7]
          bg-white
          shrink-0
          "
        >
          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            {/* INPUT */}
            <input
              type="text"
              value={message}
              onChange={handleTypingInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="
              flex-1
              h-11
              px-4
              rounded-2xl
              border
              border-[#E2E8F0]
              bg-[#F8FAFC]
              focus:outline-none
              focus:ring-4
              focus:ring-blue-100
              focus:border-[#2563EB]
              text-sm
              text-[#0F172A]
              placeholder:text-[#94A3B8]
              transition-all
              "
            />

            {/* SEND */}
            <button
              onClick={sendMessage}
              className="
              w-11
              h-11
              rounded-2xl
              bg-[#2563EB]
              hover:bg-[#1D4ED8]
              text-white
              flex
              items-center
              justify-center
              shadow-[0_10px_25px_rgba(37,99,235,0.20)]
              transition-all
              duration-300
              "
            >
              <SendHorizontal size={17} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
