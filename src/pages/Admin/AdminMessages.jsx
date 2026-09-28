import { useState } from "react";
import {
  Mail,
  MailOpen,
  Inbox,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Send,
  Eye,
  X,
  ShieldAlert,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Button from "../../components/admin/Button";
import StatCard from "../../components/admin/StatCard";
import { TableSearch, TableShell, TableState } from "../../components/admin/Table";
import {
  useContactMessages,
  useContactMessageCounts,
  useContactMessageById,
  useReplyContactMessage,
  useUpdateContactMessageStatus,
  useDeleteContactMessage,
} from "../../api/useContactApi";
import toast from "react-hot-toast";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "REPLIED", label: "Replied" },
  { key: "CLOSED", label: "Closed" },
];

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
 * Contact-message inbox. Only messages from registered + verified users ever
 * reach the backend, and replies are emailed through the backend so the panel
 * never talks to Brevo directly.
 */
function AdminMessages() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const query = useContactMessages(
    page,
    8,
    search,
    status === "all" ? "" : status,
  );
  const counts = useContactMessageCounts();
  const updateStatus = useUpdateContactMessageStatus();
  const deleteMessage = useDeleteContactMessage();

  const rows = query.data?.data?.data || [];
  const pagination = query.data?.data;

  const changeStatus = (row, nextStatus) => {
    if (row.status === nextStatus) return;
    updateStatus.mutate(
      { id: row.id, status: nextStatus },
      {
        onSuccess: (res) => toast.success(res?.message || "Status updated"),
        onError: (error) =>
          toast.error(error?.response?.data?.message || "Update failed"),
      },
    );
  };

  const confirmDeleteNow = () => {
    if (!confirmDelete) return;
    deleteMessage.mutate(confirmDelete.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Message deleted");
        setConfirmDelete(null);
        setOpenId(null);
      },
      onError: (error) =>
        toast.error(error?.response?.data?.message || "Delete failed"),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Contact form enquiries from verified users
          </p>
        </div>
        <TableSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search name, email, subject..."
        />
      </div>

      {/* Counts */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total messages"
          value={counts.data?.data?.total ?? 0}
          icon={Inbox}
          tone="indigo"
        />
        <StatCard
          label="Awaiting reply"
          value={counts.data?.data?.pending ?? 0}
          icon={Mail}
          tone="amber"
          delay={60}
        />
        <StatCard
          label="Replied"
          value={counts.data?.data?.replied ?? 0}
          icon={MailOpen}
          tone="emerald"
          delay={120}
        />
        <StatCard
          label="Closed"
          value={counts.data?.data?.closed ?? 0}
          icon={CheckCircle2}
          tone="sky"
          delay={180}
        />
      </div>

      <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 px-5 py-3.5">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                setStatus(filter.key);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                status === filter.key
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <TableShell
          headers={["Sender", "Subject", "Message", "Status", "Received", "Actions"]}
        >
          {query.isLoading || query.isError || rows.length === 0 ? (
            <TableState
              loading={query.isLoading}
              error={query.isError}
              colSpan={6}
              empty="No messages found"
            />
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={`transition hover:bg-slate-50/60 ${
                  row.status === "PENDING" ? "bg-amber-50/30" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white">
                      {(row.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {row.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {row.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[180px] px-5 py-3.5">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {row.subject || "No subject"}
                  </p>
                </td>
                <td className="max-w-[260px] px-5 py-3.5">
                  <p className="line-clamp-2 text-xs text-slate-500">
                    {row.message}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500">
                  {formatDateTime(row.createdAt)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOpenId(row.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                      <Eye size={14} />
                      Open
                    </button>
                    {row.status === "PENDING" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(row, "CLOSED")}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
                      >
                        <CheckCircle2 size={14} />
                        Close
                      </button>
                    ) : row.status === "CLOSED" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(row, "PENDING")}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-600 transition hover:bg-amber-50"
                      >
                        Reopen
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({ id: row.id, name: row.name })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </TableShell>

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete message"
        message={`The message from ${confirmDelete?.name} and all of its replies will be removed permanently.`}
        confirmLabel="Delete"
        loading={deleteMessage.isPending}
        onConfirm={confirmDeleteNow}
        onCancel={() => setConfirmDelete(null)}
      />

      {openId && (
        <MessageThreadModal id={openId} onClose={() => setOpenId(null)} />
      )}
    </AdminLayout>
  );
}

export default AdminMessages;

/*
 * Thread view: the original enquiry, the reply history and the composer that
 * triggers the backend email.
 *
 * These readers live outside the component on purpose. Inside the body the
 * React Compiler memoises `message?.contact_replies` and emits the raw member
 * read as a dependency key, which throws while the query is still loading.
 * Routing the access through plain functions keeps the optional chaining
 * where the compiler cannot rewrite it.
 */
function pickMessage(queryData) {
  return queryData?.data?.message ?? null;
}

function pickReplies(message) {
  return Array.isArray(message?.contact_replies) ? message.contact_replies : [];
}

function isUserVerified(message) {
  return Boolean(message?.user?.is_verified);
}

// Guests have no linked account (user_id is null). Unverified senders are
// linked, so treat "no account" and "account not verified" the same way for
// the panel's warning: this person has no reliable way to read the reply.
function isRegistered(message) {
  return Boolean(message?.user_id) && isUserVerified(message);
}

function MessageThreadModal({ id, onClose }) {
  const [reply, setReply] = useState("");
  const threadQuery = useContactMessageById(id);
  const sendReply = useReplyContactMessage();
  const updateStatus = useUpdateContactMessageStatus();

  const message = pickMessage(threadQuery.data);
  const replies = pickReplies(message);

  const submitReply = (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text) {
      toast.error("Please write a reply before sending.");
      return;
    }
    sendReply.mutate(
      { id, reply: text },
      {
        onSuccess: (res) => {
          setReply("");
          toast.success(res?.message || "Reply sent");
        },
        onError: (error) =>
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Reply failed",
          ),
      },
    );
  };

  const toggleClosed = () => {
    const next = message.status === "CLOSED" ? "PENDING" : "CLOSED";
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: (res) => toast.success(res?.message || "Status updated"),
        onError: (error) =>
          toast.error(error?.response?.data?.message || "Update failed"),
      },
    );
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-pop flex max-h-[88vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {message?.subject || "No subject"}
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {message ? `From ${message.name} · ${message.email}` : "Loading..."}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {message && <StatusBadge status={message.status} />}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {threadQuery.isLoading && (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            </div>
          )}

          {threadQuery.isError && (
            <p className="py-8 text-center text-sm text-red-400">
              Could not load this message.
            </p>
          )}

          {message && (
            <>
              <div className="rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Customer · {formatDateTime(message.createdAt)}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {message.message}
                </p>
              </div>

              {replies.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl rounded-tr-sm bg-indigo-600 p-4 text-white"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
                    Admin reply · {formatDateTime(item.createdAt)}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {item.reply}
                  </p>
                </div>
              ))}

              {replies.length === 0 && (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 py-6 text-xs text-slate-400">
                  <MessageSquare size={15} />
                  No replies yet — the first one goes out as an email.
                </div>
              )}
            </>
          )}
        </div>

        {/* Composer */}
        {message && (
          <form
            onSubmit={submitReply}
            className="border-t border-slate-100 px-6 py-4"
          >
            {!isRegistered(message) && (
              <div className="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                <span>
                  Sender has no account on file. The reply will go to{" "}
                  <span className="font-semibold">{message.email}</span> only
                  — keep it self-contained, there is no in-app inbox for them.
                </span>
              </div>
            )}

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder="Write your reply to the customer..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={toggleClosed}>
                {message.status === "CLOSED" ? "Reopen" : "Mark closed"}
              </Button>
              <Button
                type="submit"
                loading={sendReply.isPending}
                disabled={!reply.trim()}
              >
                <Send size={15} />
                Send reply
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
