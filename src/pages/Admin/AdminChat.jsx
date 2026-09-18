import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Search,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  Check,
  Trash2,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useSocket } from "../../hooks/useSocket";
import { useConversations, useChatVendors } from "../../api/useChatApi";
import { DeleteMessage } from "../../api/chatApi";
import { useQueryClient } from "@tanstack/react-query";

const CHAT_STORAGE_KEY = "admin_chat_state";

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

function AdminChat() {
  const queryClient = useQueryClient();
  const savedState = useRef(loadChatState()).current;
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(savedState?.currentRoom || null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  const { data: vendorsData } = useChatVendors();

  const conversations = conversationsData?.data?.conversations || [];
  const vendors = vendorsData?.data?.vendors || [];

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

  const loadMessages = useCallback(
    async (room) => {
      try {
        const response = await import("../../api/chatApi").then((m) =>
          m.GetMessages(room),
        );
        setMessages(response?.data?.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    },
    [],
  );

  const handleSelectVendor = useCallback(
    (vendor) => {
      if (currentRoom) {
        leaveChat();
      }

      setSelectedVendor(vendor);
      setMessages([]);
      setTypingUser(null);

      joinChat(vendor.id, (response) => {
        if (response?.success) {
          setCurrentRoom(response.room);
          saveChatState({ selectedVendorId: vendor.id, currentRoom: response.room });
          loadMessages(response.room);
          markMessagesRead(response.room);
        }
      });
    },
    [currentRoom, joinChat, leaveChat, loadMessages, markMessagesRead],
  );

  useEffect(() => {
    if (savedState?.selectedVendorId && savedState?.currentRoom && vendors.length > 0) {
      const vendor = vendors.find((v) => v.id === savedState.selectedVendorId);
      if (vendor) {
        handleSelectVendor(vendor);
      }
    }
  }, [vendors]);

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

  const getLastMessage = (vendorId) => {
    const conv = conversations.find(
      (c) => c.otherUser?.id === vendorId,
    );
    return conv?.lastMessage;
  };

  const getUnreadCount = (vendorId) => {
    const conv = conversations.find(
      (c) => c.otherUser?.id === vendorId,
    );
    return conv?.unreadCount || 0;
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* ================= VENDOR LIST SIDEBAR ================= */}
        <div
          className={`w-full shrink-0 border-r border-slate-100 md:w-[340px] ${
            selectedVendor ? "hidden md:flex" : "flex"
          } flex-col`}
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Messages</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {isConnected ? "Connected" : "Connecting..."}
            </p>
          </div>

          <div className="px-4 py-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredVendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                <MessageCircle size={40} className="text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                  No vendors found
                </p>
              </div>
            ) : (
              filteredVendors.map((vendor) => {
                const lastMsg = getLastMessage(vendor.id);
                const unread = getUnreadCount(vendor.id);
                const isSelected = selectedVendor?.id === vendor.id;

                return (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleSelectVendor(vendor)}
                    className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50 ${
                      isSelected ? "bg-indigo-50 border-r-2 border-indigo-500" : ""
                    }`}
                  >
                    <div className="relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {vendor.name?.charAt(0)?.toUpperCase()}
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isUserOnline(vendor.id) ? "bg-emerald-400" : "bg-slate-300"}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {vendor.name}
                        </p>
                        {lastMsg && (
                          <span className="ml-2 shrink-0 text-[10px] text-slate-400">
                            {formatTime(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {lastMsg ? lastMsg.message : vendor.email}
                        </p>
                        {unread > 0 && (
                          <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= CHAT WINDOW ================= */}
        <div
          className={`flex flex-1 flex-col ${
            selectedVendor ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedVendor ? (
            <>
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVendor(null);
                    setCurrentRoom(null);
                    leaveChat();
                    clearChatState();
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                  {selectedVendor.name?.charAt(0)?.toUpperCase()}
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isUserOnline(selectedVendor.id) ? "bg-emerald-400" : "bg-slate-300"}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    {selectedVendor.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isUserOnline(selectedVendor.id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <MessageCircle size={28} className="text-slate-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Start a conversation
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Send a message to {selectedVendor.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, idx) => {
                      const isOwn = msg.sender_id !== selectedVendor.id;
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
                    })}

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
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <MessageCircle size={36} className="text-slate-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-600">
                Select a vendor to start chatting
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Choose a vendor from the list to begin a conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminChat;
