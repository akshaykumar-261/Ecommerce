import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const handlersRef = useRef({
    receive_message: [],
    user_typing: [],
    user_stop_typing: [],
    messages_read: [],
    chat_deleted: [],
    message_deleted: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    socket.on("online_users", (userIds) => {
      setOnlineUserIds(userIds);
    });

    socket.on("receive_message", (msg) => {
      handlersRef.current.receive_message.forEach((fn) => fn(msg));
    });

    socket.on("user_typing", (data) => {
      handlersRef.current.user_typing.forEach((fn) => fn(data));
    });

    socket.on("user_stop_typing", (data) => {
      handlersRef.current.user_stop_typing.forEach((fn) => fn(data));
    });

    socket.on("messages_read", (data) => {
      handlersRef.current.messages_read.forEach((fn) => fn(data));
    });

    socket.on("chat_deleted", (data) => {
      handlersRef.current.chat_deleted.forEach((fn) => fn(data));
    });

    socket.on("message_deleted", (data) => {
      handlersRef.current.message_deleted.forEach((fn) => fn(data));
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setOnlineUserIds([]);
    };
  }, []);

  const isUserOnline = useCallback(
    (userId) => {
      return onlineUserIds.includes(userId);
    },
    [onlineUserIds],
  );

  const subscribe = useCallback((event, handler) => {
    if (handlersRef.current[event]) {
      handlersRef.current[event].push(handler);
    }
    return () => {
      if (handlersRef.current[event]) {
        handlersRef.current[event] = handlersRef.current[event].filter(
          (fn) => fn !== handler,
        );
      }
    };
  }, []);

  const joinChat = useCallback((userId, callback) => {
    const socket = socketRef.current;
    if (!socket) {
      callback?.({ success: false, message: "Socket not connected" });
      return;
    }
    const doJoin = () => {
      socket.emit("join_chat", { user_id: userId }, callback);
    };
    if (socket.connected) {
      doJoin();
    } else {
      socket.once("connect", doJoin);
    }
  }, []);

  const sendMessage = useCallback((message, callback) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      callback?.({ success: false, message: "Socket not connected" });
      return;
    }
    socket.emit("send_message", { message }, (response) => {
      callback?.(response);
    });
  }, []);

  const startTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("typing");
  }, []);

  const stopTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("stop_typing");
  }, []);

  const markMessagesRead = useCallback((room, callback) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      callback?.({ success: false, message: "Socket not connected" });
      return;
    }
    socket.emit("mark_messages_read", { room }, callback);
  }, []);

  const leaveChat = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;
    socket.emit("leave_chat");
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    onlineUserIds,
    isUserOnline,
    subscribe,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesRead,
    leaveChat,
  };
}
