import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["ShopEase Headquarters", "Gurugram, Haryana, India"],
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@shopease.com", "care@shopease.com"],
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 98765 43210", "Mon–Sat, 9 AM – 9 PM"],
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday – Saturday", "9:00 AM – 9:00 PM IST"],
    color: "bg-orange-50 text-orange-500",
  },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm(initialForm);
      toast.success("Message sent! We'll get back to you soon.");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Headphones size={14} />
            Contact Us
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            We'd love to hear from you
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90">
            Questions about an order, need help with a product, or just want to
            say hello? Drop us a message and our team will get back to you within
            24 hours.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-gray-200/50"
              >
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-sm text-gray-500">
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Form + Side */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm lg:col-span-3">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4c2ed8]/10">
                <MessageCircle size={20} className="text-[#4c2ed8]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Send a message
                </h2>
                <p className="text-sm text-gray-500">
                  Fill the form and we'll reply as soon as possible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us a bit more about your query..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#365fe0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/25 transition-all hover:shadow-xl hover:shadow-[#4c2ed8]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={16} />
                )}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Side */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8] p-8 text-white shadow-xl shadow-[#4c2ed8]/20">
              <h3 className="mb-3 text-lg font-bold">Need instant answers?</h3>
              <p className="mb-6 text-sm leading-relaxed text-white/90">
                Many common questions are answered in our FAQ. Save time and
                check it out — you might find exactly what you're looking for.
              </p>
              <button
                onClick={() => navigate("/faq")}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#4c2ed8] transition hover:bg-gray-100"
              >
                Browse FAQs
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Follow ShopEase
              </h3>
              {[
                { label: "Instagram", tag: "@shopease.official" },
                { label: "Facebook", tag: "/ShopEaseIndia" },
                { label: "X (Twitter)", tag: "@ShopEase" },
              ].map((social) => (
                <div
                  key={social.label}
                  className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {social.label}
                  </span>
                  <span className="text-sm text-[#4c2ed8]">{social.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;