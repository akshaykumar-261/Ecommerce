import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  Check,
  Headphones,
  Trash2,
} from "lucide-react";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useSocket } from "../../hooks/useSocket";
import { useConversations, useChatAdmin } from "../../api/useChatApi";
import { DeleteMessage } from "../../api/chatApi";
import { useQueryClient } from "@tanstack/react-query";

const CHAT_STORAGE_KEY = "vendor_chat_state";

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function loadChatState() {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveChatState(state) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearChatState() {
  localStorage.removeItem(CHAT_STORAGE_KEY);
}

function VendorChat() {
  const queryClient = useQueryClient();
  const savedState = useRef(loadChatState()).current;
  const [chatStarted, setChatStarted] = useState(savedState?.chatStarted || false);
  const [currentRoom, setCurrentRoom] = useState(savedState?.currentRoom || null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    isConnected,
    isUserOnline,
    subscribe,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesRead,
    leaveChat,
  } = useSocket();

  const { data: conversationsData } = useConversations();
  const { data: adminData } = useChatAdmin();

  const admin = adminData?.data?.admin;
  const conversations = conversationsData?.data?.conversations || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubs = [
      subscribe("receive_message", (msg) => {
        setMessages((prev) => [...prev, msg]);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }),
      subscribe("user_typing", ({ user_name }) => {
        setTypingUser(user_name);
      }),
      subscribe("user_stop_typing", () => {
        setTypingUser(null);
      }),
      subscribe("messages_read", () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }),
      subscribe("chat_deleted", () => {
        setMessages([]);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }),
      subscribe("message_deleted", ({ messageId }) => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [subscribe, queryClient]);

  const loadMessages = useCallback(async (room) => {
    try {
      const response = await import("../../api/chatApi").then((m) =>
        m.GetMessages(room),
      );
      setMessages(response?.data?.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, []);

  const joinAndLoad = useCallback(
    (userId) => {
      joinChat(userId, (response) => {
        if (response?.success) {
          setCurrentRoom(response.room);
          setChatStarted(true);
          saveChatState({ chatStarted: true, currentRoom: response.room });
          loadMessages(response.room);
          markMessagesRead(response.room);
        }
      });
    },
    [joinChat, loadMessages, markMessagesRead],
  );

  useEffect(() => {
    if (savedState?.chatStarted && savedState?.currentRoom && admin) {
      joinAndLoad(admin.id);
    }
  }, [admin]);

  const handleStartChat = () => {
    if (!admin) return;
    joinAndLoad(admin.id);
  };

  const handleBack = () => {
    leaveChat();
    setChatStarted(false);
    setCurrentRoom(null);
    setMessages([]);
    clearChatState();
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await DeleteMessage(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentRoom) return;

    sendMessage(message.trim(), (response) => {
      if (!response?.success) {
        console.error("Failed to send:", response?.message);
      }
    });
    setMessage("");
    stopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      startTyping();
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const lastConversation = conversations.find(
    (c) => c.otherUser?.id === admin?.id,
  );

  const myId = adminData?.data?.admin?.id;

  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar />
      <div className="min-h-screen lg:ml-[270px]">
        <Topbar />
        <main className="p-5 lg:p-7">
          <div className="mx-auto flex h-[calc(100vh-140px)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* ================= CHAT HEADER ================= */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
              {chatStarted && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="relative h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
                <Headphones size={20} />
                {admin && (
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isUserOnline(admin.id) ? "bg-emerald-400" : "bg-slate-300"}`} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  {admin?.name || "Admin Support"}
                </p>
                <p className="text-xs text-slate-400">
                  {admin && isUserOnline(admin.id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* ================= MESSAGES AREA ================= */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!chatStarted ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                    <Headphones size={36} className="text-indigo-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-700">
                    Chat with Admin
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-slate-400">
                    Have a question or need help? Start a conversation
                    with our support team.
                  </p>

                  {lastConversation?.lastMessage && (
                    <div className="mt-6 rounded-xl bg-slate-50 px-5 py-3">
                      <p className="text-xs text-slate-400">Last message</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {lastConversation.lastMessage.message}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatTime(lastConversation.lastMessage.createdAt)}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartChat}
                    disabled={!isConnected || !admin}
                    className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={16} />
                    {lastConversation ? "Continue Chat" : "Start Chat"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <MessageCircle size={28} className="text-slate-400" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Start a conversation
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Send a message to admin
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isOwn = msg.sender_id !== myId;
                      const showDate =
                        idx === 0 ||
                        formatDate(msg.createdAt) !==
                          formatDate(messages[idx - 1]?.createdAt);

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="my-4 flex items-center gap-3">
                              <div className="h-px flex-1 bg-slate-200" />
                              <span className="shrink-0 text-[11px] font-medium text-slate-400">
                                {formatDate(msg.createdAt)}
                              </span>
                              <div className="h-px flex-1 bg-slate-200" />
                            </div>
                          )}
                          <div
                            className={`group flex ${isOwn ? "justify-end" : "justify-start"}`}
                            onMouseEnter={() => setHoveredMsgId(msg.id)}
                            onMouseLeave={() => setHoveredMsgId(null)}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                isOwn
                                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.message}
                              </p>
                              <div
                                className={`mt-1 flex items-center justify-end gap-1 ${
                                  isOwn ? "text-white/70" : "text-slate-400"
                                }`}
                              >
                                <span className="text-[10px]">
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isOwn && (
                                  <span>
                                    {msg.is_read ? (
                                      <CheckCheck size={12} />
                                    ) : (
                                      <Check size={12} />
                                    )}
                                  </span>
                                )}
                                {isOwn && hoveredMsgId === msg.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="ml-1 rounded p-0.5 transition hover:bg-white/20"
                                    title="Delete message"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {typingUser && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-slate-100 px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* ================= INPUT ================= */}
            {chatStarted && (
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={message}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default VendorChat;
