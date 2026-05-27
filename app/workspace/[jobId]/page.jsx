"use client";

import { useEffect, useRef, useState } from "react";

import {
  ShieldCheck,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  Clock3,
  MessageSquare,
  SendHorizonal,
  FolderKanban,
  User2,
  ImageIcon,
  Paperclip,
  Circle,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";

import io from "socket.io-client";

let socket;

export default function WorkspacePage({
  workspace,
  messages = [],
  currentUser,
  onSendMessage,
}) {
  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState(messages);

  const messagesEndRef = useRef(null);

  // =========================================
  // SOCKET
  // =========================================

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.emit("joinWorkspace", workspace?._id);

    socket.on("workspaceMessage", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [workspace]);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  // =========================================
  // SEND
  // =========================================

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      message: chatMessage,

      sender: currentUser,
    };

    socket.emit("workspaceMessage", {
      workspaceId: workspace?._id,

      message: newMessage,
    });

    if (onSendMessage) {
      onSendMessage(chatMessage);
    }

    setChatMessage("");
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      "
    >
      {/* ========================================= */}
      {/* TOP BAR */}
      {/* ========================================= */}

      <div
        className="
        sticky
        top-0
        z-40
        border-b
        border-[#E2E8F0]
        bg-white/90
        backdrop-blur-xl
        "
      >
        <div
          className="
          px-8
          py-5
          "
        >
          <div
            className="
            flex
            flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-6
            "
          >
            {/* LEFT */}
            <div>
              <div
                className="
                flex
                items-center
                gap-4
                "
              >
                <div
                  className="
                  w-14
                  h-14
                  rounded-[20px]
                  bg-[#0F172A]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  "
                >
                  <FolderKanban size={24} />
                </div>

                <div>
                  <h1
                    className="
                    text-[34px]
                    leading-none
                    font-[900]
                    tracking-tight
                    text-[#0F172A]
                    "
                  >
                    {workspace?.title}
                  </h1>

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    mt-2
                    "
                  >
                    Project collaboration workspace
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="
              flex
              flex-wrap
              items-center
              gap-3
              "
            >
              {/* STATUS */}
              <div
                className="
                inline-flex
                items-center
                gap-2
                h-12
                px-5
                rounded-2xl
                bg-emerald-50
                border
                border-emerald-100
                text-emerald-700
                text-sm
                font-bold
                "
              >
                <Circle
                  size={10}
                  className="
                  fill-emerald-500
                  "
                />
                In Progress
              </div>

              {/* ACTION */}
              <button
                className="
                h-12
                px-5
                rounded-2xl
                bg-[#2563EB]
                hover:bg-[#1D4ED8]
                text-white
                text-sm
                font-bold
                shadow-[0_10px_25px_rgba(37,99,235,0.20)]
                transition-all
                duration-300
                "
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MAIN GRID */}
      {/* ========================================= */}

      <div
        className="
        grid
        grid-cols-12
        gap-6
        p-6
        "
      >
        {/* ========================================= */}
        {/* LEFT SIDEBAR */}
        {/* ========================================= */}

        <div
          className="
          col-span-12
          xl:col-span-3
          space-y-6
          "
        >
          {/* PROJECT CARD */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <div
              className="
              flex
              items-start
              gap-4
              mb-5
              "
            >
              <div
                className="
                w-14
                h-14
                rounded-[20px]
                bg-[#EFF6FF]
                text-[#2563EB]
                flex
                items-center
                justify-center
                "
              >
                <FolderKanban size={24} />
              </div>

              <div>
                <h2
                  className="
                  text-[20px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Project Overview
                </h2>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-1
                  "
                >
                  Active workspace
                </p>
              </div>
            </div>

            <p
              className="
              text-sm
              leading-8
              text-[#475569]
              "
            >
              {workspace?.description}
            </p>
          </div>

          {/* TIMELINE */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <h3
              className="
              text-[18px]
              font-[900]
              tracking-tight
              text-[#0F172A]
              mb-6
              "
            >
              Project Timeline
            </h3>

            <div className="space-y-5">
              {[
                {
                  label: "Proposal Accepted",

                  done: true,
                },

                {
                  label: "Payment Secured",

                  done: true,
                },

                {
                  label: "Visit Scheduled",

                  done: true,
                },

                {
                  label: "Work In Progress",

                  done: true,
                },

                {
                  label: "Final Review",

                  done: false,
                },

                {
                  label: "Completed",

                  done: false,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                  flex
                  items-center
                  gap-4
                  "
                >
                  <div
                    className={`
                    w-11
                    h-11
                    rounded-2xl
                    flex
                    items-center
                    justify-center

                    ${
                      item.done
                        ? `
                          bg-emerald-50
                          text-emerald-600
                        `
                        : `
                          bg-[#F8FAFC]
                          text-[#94A3B8]
                        `
                    }
                    `}
                  >
                    {item.done ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock3 size={18} />
                    )}
                  </div>

                  <p
                    className={`
                    text-sm
                    font-semibold

                    ${
                      item.done
                        ? `
                          text-[#0F172A]
                        `
                        : `
                          text-[#94A3B8]
                        `
                    }
                    `}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <div
              className="
              flex
              items-center
              justify-between
              mb-5
              "
            >
              <div>
                <h3
                  className="
                  text-[18px]
                  font-[900]
                  tracking-tight
                  text-[#0F172A]
                  "
                >
                  Payment Status
                </h3>

                <p
                  className="
                  text-sm
                  text-[#64748B]
                  mt-1
                  "
                >
                  Escrow protected
                </p>
              </div>

              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-emerald-50
                text-emerald-600
                flex
                items-center
                justify-center
                "
              >
                <DollarSign size={22} />
              </div>
            </div>

            <div
              className="
              flex
              items-center
              justify-between
              "
            >
              <div>
                <p
                  className="
                  text-sm
                  text-[#64748B]
                  "
                >
                  Current Status
                </p>

                <p
                  className="
                  text-lg
                  font-bold
                  text-emerald-600
                  mt-1
                  "
                >
                  Secured
                </p>
              </div>

              <div
                className="
                inline-flex
                items-center
                gap-2
                px-4
                h-10
                rounded-2xl
                bg-emerald-50
                border
                border-emerald-100
                text-emerald-700
                text-sm
                font-bold
                "
              >
                <ShieldCheck size={15} />
                Protected
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* CENTER CHAT */}
        {/* ========================================= */}

        <div
          className="
          col-span-12
          xl:col-span-6
          "
        >
          <div
            className="
            flex
            flex-col
            h-[calc(100vh-170px)]
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            overflow-hidden
            "
          >
            {/* CHAT HEADER */}
            <div
              className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-[#EEF2F7]
              "
            >
              <div
                className="
                flex
                items-center
                gap-4
                "
              >
                {/* AVATAR */}
                <div
                  className="
                  relative
                  "
                >
                  <div
                    className="
                    w-14
                    h-14
                    rounded-[20px]
                    bg-[#2563EB]
                    text-white
                    text-xl
                    font-black
                    flex
                    items-center
                    justify-center
                    "
                  >
                    M
                  </div>

                  <div
                    className="
                    absolute
                    bottom-0
                    right-0
                    w-4
                    h-4
                    rounded-full
                    bg-emerald-500
                    border-2
                    border-white
                    "
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
                    <h3
                      className="
                      text-[20px]
                      font-[900]
                      tracking-tight
                      text-[#0F172A]
                      "
                    >
                      Workspace Chat
                    </h3>

                    <BadgeCheck
                      size={16}
                      className="
                      text-[#2563EB]
                      "
                    />
                  </div>

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    mt-1
                    "
                  >
                    Live collaboration channel
                  </p>
                </div>
              </div>

              <button
                className="
                w-11
                h-11
                rounded-2xl
                hover:bg-[#F8FAFC]
                text-[#64748B]
                flex
                items-center
                justify-center
                transition
                "
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* MESSAGES */}
            <div
              className="
              flex-1
              overflow-y-auto
              px-6
              py-6
              space-y-5
              bg-[#FAFBFC]
              "
            >
              {chatMessages.length === 0 ? (
                <div
                  className="
                  h-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  "
                >
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
                    mb-6
                    shadow-sm
                    "
                  >
                    <MessageSquare
                      size={40}
                      className="
                      text-[#94A3B8]
                      "
                    />
                  </div>

                  <h3
                    className="
                    text-[24px]
                    font-[900]
                    tracking-tight
                    text-[#0F172A]
                    "
                  >
                    Start Collaboration
                  </h3>

                  <p
                    className="
                    text-sm
                    text-[#64748B]
                    mt-3
                    max-w-[320px]
                    leading-7
                    "
                  >
                    Messages, updates, and shared project communication will
                    appear here.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const mine = msg.sender?._id === currentUser?._id;

                  return (
                    <div
                      key={index}
                      className={`
                        flex

                        ${
                          mine
                            ? `
                              justify-end
                            `
                            : `
                              justify-start
                            `
                        }
                        `}
                    >
                      <div
                        className={`
                          max-w-[78%]
                          rounded-[28px]
                          px-5
                          py-4
                          shadow-sm

                          ${
                            mine
                              ? `
                                bg-[#2563EB]
                                text-white
                                rounded-br-md
                              `
                              : `
                                bg-white
                                border
                                border-[#E2E8F0]
                                text-[#0F172A]
                                rounded-bl-md
                              `
                          }
                          `}
                      >
                        <p
                          className="
                            text-sm
                            leading-7
                            "
                        >
                          {msg.message}
                        </p>

                        <div
                          className={`
                            text-xs
                            mt-3

                            ${
                              mine
                                ? `
                                  text-blue-100
                                `
                                : `
                                  text-[#94A3B8]
                                `
                            }
                            `}
                        >
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div
              className="
              px-6
              py-5
              border-t
              border-[#EEF2F7]
              bg-white
              "
            >
              <div
                className="
                flex
                items-center
                gap-4
                "
              >
                {/* ATTACH */}
                <button
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#F8FAFC]
                  hover:bg-[#EFF6FF]
                  text-[#64748B]
                  hover:text-[#2563EB]
                  border
                  border-[#E2E8F0]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  "
                >
                  <Paperclip size={18} />
                </button>

                {/* INPUT */}
                <div className="flex-1">
                  <input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className="
                    w-full
                    h-14
                    rounded-[22px]
                    border
                    border-[#E2E8F0]
                    bg-[#FAFBFC]
                    px-5
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#2563EB]
                    focus:ring-4
                    focus:ring-blue-100
                    "
                  />
                </div>

                {/* SEND */}
                <button
                  onClick={handleSend}
                  className="
                  w-14
                  h-14
                  rounded-[22px]
                  bg-[#2563EB]
                  hover:bg-[#1D4ED8]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-[0_12px_25px_rgba(37,99,235,0.20)]
                  transition-all
                  duration-300
                  "
                >
                  <SendHorizonal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT PANEL */}
        {/* ========================================= */}

        <div
          className="
          col-span-12
          xl:col-span-3
          space-y-6
          "
        >
          {/* PARTICIPANTS */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <h3
              className="
              text-[18px]
              font-[900]
              tracking-tight
              text-[#0F172A]
              mb-6
              "
            >
              Participants
            </h3>

            <div className="space-y-5">
              {["Homeowner", "Tradesperson"].map((user, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                    "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      "
                  >
                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-[#EFF6FF]
                        text-[#2563EB]
                        font-bold
                        flex
                        items-center
                        justify-center
                        "
                    >
                      {user.charAt(0)}
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-bold
                          text-[#0F172A]
                          "
                      >
                        {user}
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#64748B]
                          mt-1
                          "
                      >
                        Active member
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      w-3
                      h-3
                      rounded-full
                      bg-emerald-500
                      "
                  />
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <h3
              className="
              text-[18px]
              font-[900]
              tracking-tight
              text-[#0F172A]
              mb-6
              "
            >
              Quick Actions
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: "Schedule Visit",

                  icon: CalendarDays,
                },

                {
                  label: "Upload Images",

                  icon: ImageIcon,
                },

                {
                  label: "Complete Project",

                  icon: CheckCircle2,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={index}
                    className="
                      w-full
                      h-14
                      rounded-[22px]
                      border
                      border-[#E2E8F0]
                      bg-[#FAFBFC]
                      hover:bg-[#EFF6FF]
                      hover:border-[#BFDBFE]
                      flex
                      items-center
                      gap-4
                      px-5
                      transition-all
                      duration-300
                      "
                  >
                    <div
                      className="
                        w-10
                        h-10
                        rounded-2xl
                        bg-white
                        border
                        border-[#E2E8F0]
                        text-[#2563EB]
                        flex
                        items-center
                        justify-center
                        "
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      className="
                        text-sm
                        font-bold
                        text-[#0F172A]
                        "
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVITY */}
          <div
            className="
            rounded-[32px]
            border
            border-[#E2E8F0]
            bg-white
            p-6
            shadow-[0_10px_30px_rgba(15,23,42,0.04)]
            "
          >
            <h3
              className="
              text-[18px]
              font-[900]
              tracking-tight
              text-[#0F172A]
              mb-6
              "
            >
              Activity Feed
            </h3>

            <div className="space-y-5">
              {[
                "Payment completed",

                "Workspace created",

                "Project started",

                "Message sent",
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-4
                    "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-2xl
                      bg-[#EFF6FF]
                      text-[#2563EB]
                      flex
                      items-center
                      justify-center
                      shrink-0
                      "
                  >
                    <Clock3 size={16} />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#0F172A]
                        "
                    >
                      {item}
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#94A3B8]
                        mt-2
                        "
                    >
                      Recently updated
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
