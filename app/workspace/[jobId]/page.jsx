"use client";

import { useEffect, useRef, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  Clock3,
  MessageSquare,
  SendHorizontal,
  FolderKanban,
  User2,
  Lock,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Star
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../../../components/Navbar";
import api from "../../../services/api";
import socket from "../../../services/socket";
import { useAuth } from "../../../context/AuthContext";

import ScheduleModal from "../../../components/ScheduleModal";
import PaymentModal from "../../../components/PaymentModal";
import ReviewModal from "../../../components/ReviewModal";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId;
  const { user } = useAuth();

  // STATED DATA
  const [workspace, setWorkspace] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // =========================================
  // FETCH WORKSPACE
  // =========================================
  const fetchWorkspace = async () => {
    if (!jobId) return;
    try {
      const res = await api.get(`/jobs/${jobId}`);
      setWorkspace(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workspace details");
    }
  };

  // =========================================
  // FETCH MESSAGES
  // =========================================
  const fetchMessages = async () => {
    if (!jobId) return;
    try {
      const res = await api.get(`/messages/${jobId}`);
      setChatMessages(res.data);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  // =========================================
  // SOCKET & RE-INITIALIZATION
  // =========================================
  useEffect(() => {
    if (!jobId || !user) return;

    setLoading(true);
    Promise.all([fetchWorkspace(), fetchMessages()]).finally(() => {
      setLoading(false);
    });

    // Join room
    socket.emit("joinRoom", jobId);

    // Socket message receive
    const handleReceiveMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [jobId, user]);

  // =========================================
  // AUTO SCROLL
  // =========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  // =========================================
  // SEND MESSAGE
  // =========================================
  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    try {
      const messageData = {
        sender: user.id || user._id,
        job: jobId,
        text: chatMessage,
      };

      const res = await api.post("/messages", messageData);
      socket.emit("sendMessage", res.data);
      setChatMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  // =========================================
  // COMPLETION FLOWS
  // =========================================
  const handleRequestCompletion = async () => {
    try {
      setLoading(true);
      await api.patch(`/jobs/${jobId}/request-completion`);
      toast.success("Completion request submitted successfully!");
      fetchWorkspace();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit completion request");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompletion = async () => {
    try {
      setLoading(true);
      await api.patch(`/jobs/${jobId}/approve-completion`);
      toast.success("Project marked as completed!");
      await fetchWorkspace();
      setReviewOpen(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to approve completion");
    } finally {
      setLoading(false);
    }
  };

  // SAFETY LOADING
  if (loading && !workspace) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/25 border-t-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // ROLES
  const isHomeowner = user?.id === workspace?.createdBy?._id || user?._id === workspace?.createdBy?._id;
  const isTradesperson = user?.id === workspace?.assignedTradesperson?._id || user?._id === workspace?.assignedTradesperson?._id || user?.id === workspace?.assignedTradesperson || user?._id === workspace?.assignedTradesperson;

  // RENDER DATE
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Scheduled";
    return new Date(dateStr).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0F172A] text-slate-100 pt-[74px] flex flex-col font-sans">
        {/* TOP BANNER */}
        <div className="relative overflow-hidden border-b border-slate-800 bg-[#1E293B]/60 backdrop-blur-md px-6 py-5">
          {/* Subtle neon gradient blurs */}
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute right-10 top-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_8px_20px_rgba(99,102,241,0.25)]">
                <FolderKanban className="text-white" size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {workspace?.title}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                    Live Room
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Category: {workspace?.category || "General"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                workspace?.status === "Completed"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : workspace?.status === "In Progress"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  workspace?.status === "Completed" ? "bg-emerald-500" : workspace?.status === "In Progress" ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                }`} />
                {workspace?.status || "Open"}
              </span>

              {/* ACTION: Schedule Visit */}
              {isTradesperson && workspace?.status !== "Completed" && (
                <button
                  onClick={() => setScheduleOpen(true)}
                  className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-[0_6px_15px_rgba(99,102,241,0.3)]"
                >
                  Schedule Visit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WORKSPACE LAYOUT */}
        <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 relative">
          
          {/* SIDEBAR LEFT */}
          <div className="col-span-12 xl:col-span-3 space-y-6">
            {/* OVERVIEW */}
            <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/40 p-5 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-3">
                Project Overview
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {workspace?.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Budget</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">${workspace?.budget || "0.00"}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Location</span>
                  <p className="text-sm font-bold text-slate-300 mt-0.5 truncate">{workspace?.location || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/40 p-5 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4">
                Timeline Progress
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Job Created", checked: true },
                  { label: "Tradesperson Hired", checked: !!workspace?.assignedTradesperson },
                  { label: "Visit Scheduled", checked: !!workspace?.scheduledDate, desc: formatDate(workspace?.scheduledDate) },
                  { label: "Completion Requested", checked: !!workspace?.completionRequested },
                  { label: "Approved & Completed", checked: workspace?.status === "Completed" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      item.checked
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}>
                      {item.checked ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${item.checked ? "text-slate-200" : "text-slate-500"}`}>
                        {item.label}
                      </p>
                      {item.desc && (
                        <p className="text-[10px] text-indigo-400 mt-0.5 font-medium">{item.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY/ESCROW PROTECTED */}
            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-indigo-950/20 to-slate-900 p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Escrow Protected</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Payments are locked in secure platform escrow and only released once work completion is approved.
                </p>
              </div>
            </div>
          </div>

          {/* CHAT CONTAINER CENTER */}
          <div className="col-span-12 xl:col-span-6 flex flex-col h-[600px] border border-slate-800 bg-[#1E293B]/20 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* CHAT HEADER */}
            <div className="h-16 border-b border-slate-800 bg-[#1E293B]/40 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-xs font-black">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Collaboration Chat</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Messages are logged securely for compliance</span>
                </div>
              </div>
            </div>

            {/* MESSAGES SCROLL */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B0F19]/60">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-slate-500">
                    <MessageSquare size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">Start the Conversation</h4>
                  <p className="text-xs text-slate-500 mt-2 max-w-[280px]">
                    Send a message to agree on visit schedules, details, and project objectives.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => {
                  const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
                  const isMine = senderId === (user.id || user._id);
                  const senderName = typeof msg.sender === "object" ? msg.sender?.name : (isMine ? user.name : "Member");

                  return (
                    <div key={idx} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <span className="text-[10px] text-slate-500 mb-1 px-1">{senderName}</span>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        isMine
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(99,102,241,0.2)]"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60"
                      }`}>
                        <p>{msg.text}</p>
                        <div className="text-right mt-1.5">
                          <span className={`text-[9px] ${isMine ? "text-indigo-200" : "text-slate-500"}`}>
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT */}
            <div className="p-4 border-t border-slate-800 bg-[#1E293B]/40 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="flex-1 h-11 bg-[#0F172A] border border-slate-800 rounded-xl px-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-all"
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR RIGHT */}
          <div className="col-span-12 xl:col-span-3 space-y-6">
            
            {/* WORKSPACE MEMBERS */}
            <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/40 p-5 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4">
                Participants
              </h2>
              <div className="space-y-4">
                {/* Homeowner */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold uppercase">
                      {workspace?.createdBy?.name?.charAt(0) || "H"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        {workspace?.createdBy?.name || "Homeowner"}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Homeowner</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                {/* Tradesperson */}
                {workspace?.assignedTradesperson ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold uppercase">
                        {workspace?.assignedTradesperson?.name?.charAt(0) || "T"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">
                          {workspace?.assignedTradesperson?.name || "Tradesperson"}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Tradesperson</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ) : (
                  <div className="py-2 text-center border border-dashed border-slate-800 rounded-xl">
                    <p className="text-[11px] text-slate-500">No tradesperson assigned yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* WORKFLOW QUICK ACTIONS */}
            <div className="rounded-2xl border border-slate-800 bg-[#1E293B]/40 p-5 shadow-sm">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                {/* Secure Escrow Payment (Homeowner only) */}
                {isHomeowner && workspace?.status === "Open" && (
                  <button
                    onClick={() => setPaymentOpen(true)}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <CreditCard size={14} />
                    Secure Escrow Payment
                  </button>
                )}

                {/* Schedule Visit (Tradesperson only) */}
                {isTradesperson && workspace?.status !== "Completed" && (
                  <button
                    onClick={() => setScheduleOpen(true)}
                    className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <CalendarDays size={14} className="text-indigo-400" />
                    Schedule Visit Time
                  </button>
                )}

                {/* Request Work Completion (Tradesperson only) */}
                {isTradesperson && workspace?.status === "In Progress" && !workspace?.completionRequested && (
                  <button
                    onClick={handleRequestCompletion}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <CheckCircle2 size={14} />
                    Request Completion
                  </button>
                )}

                {/* Approve Completion (Homeowner only) */}
                {isHomeowner && workspace?.status === "In Progress" && workspace?.completionRequested && (
                  <button
                    onClick={handleApproveCompletion}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all animate-bounce"
                  >
                    <CheckCircle2 size={14} />
                    Approve Work Completion
                  </button>
                )}

                {/* Submit Review (Homeowner only, when Completed) */}
                {isHomeowner && workspace?.status === "Completed" && (
                  <button
                    onClick={() => setReviewOpen(true)}
                    className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Star size={14} />
                    Submit Review Feed
                  </button>
                )}

                {/* MOCK Status logs */}
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed space-y-1.5">
                  <p>• Escrow holds funds securely.</p>
                  <p>• Direct messaging is recorded.</p>
                  <p>• Raise issues to support if required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WORKSPACE MODALS */}
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          fetchWorkspace();
        }}
        jobId={jobId}
      />

      <PaymentModal
        open={paymentOpen}
        onClose={() => {
          setPaymentOpen(false);
          fetchWorkspace();
        }}
        job={workspace}
      />

      <ReviewModal
        open={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
          fetchWorkspace();
        }}
        jobId={jobId}
      />
    </>
  );
}
