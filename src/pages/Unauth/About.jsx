import {
  Zap,
  Shield,
  Truck,
  RefreshCcw,
  Headphones,
  Award,
  Users,
  Package,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products" },
  { value: "500+", label: "Verified Sellers" },
  { value: "24/7", label: "Support" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Quality First",
    desc: "Every product is hand-picked and quality-checked before it reaches your doorstep, so you always get the best.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free and speedy delivery on thousands of products, with real-time tracking from our warehouse to your home.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "All transactions are encrypted and protected. Pay your way with UPI, cards, wallets, or cash on delivery.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Changed your mind? Enjoy a hassle-free 7-day return and refund policy on eligible items.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our friendly support team is always available to help with orders, returns, or any question you have.",
  },
  {
    icon: Award,
    title: "Trusted by Millions",
    desc: "Join millions of shoppers who rely on ShopEase for fair prices, genuine products, and a seamless experience.",
  },
];

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Zap size={14} />
            About ShopEase
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Shopping made simple, honest & delightful
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90">
            ShopEase is India's most loved online marketplace. We bring
            quality products from trusted sellers straight to your door at
            unbeatable prices — so you can spend less time hunting and more
            time enjoying.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 text-center shadow-lg shadow-gray-200/50"
            >
              <p className="text-2xl font-extrabold text-[#4c2ed8]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] p-1">
              <div className="flex h-72 items-center justify-center rounded-3xl bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8]">
                    <Package size={28} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Est. 2021
                  </p>
                  <p className="text-xs text-gray-500">
                    Built with love in India
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#4c2ed8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4c2ed8]">
              Our Story
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              From a small idea to a smarter way to shop
            </h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              ShopEase started in 2021 with a simple belief — shopping online
              should feel effortless, fair, and trustworthy. We began by
              partnering with local sellers to bring genuine products at
              honest prices, and today we serve millions of happy customers
              across the country.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether it's day-to-day essentials, the latest gadgets, or
              fashion for every season, we're here to make sure you find
              exactly what you need — backed by secure payments, fast
              delivery, and support that actually cares.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-[#4c2ed8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4c2ed8]">
              Why ShopEase
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you expect from a trusted store
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-gray-100 bg-[#f8f9fc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4c2ed8]/20 hover:bg-white hover:shadow-xl hover:shadow-[#4c2ed8]/10"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4c2ed8] to-[#368de8] text-white shadow-lg shadow-[#4c2ed8]/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#4c2ed8]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#4c2ed8]">
            Our Mission
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Built by people who love to shop
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            A passionate team of engineers, designers, and shopping
            enthusiasts working hard to make every order feel personal.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Users, title: "Customer Obsessed", desc: "We measure success by one thing — your happiness." },
            { icon: Zap, title: "Agile & Smart", desc: "We move fast to bring you new products and deals." },
            { icon: Shield, title: "Always Transparent", desc: "No hidden fees, no surprises — ever." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4c2ed8]/10">
                  <Icon size={26} className="text-[#4c2ed8]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8] p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative mb-3 text-3xl font-bold text-white">
            Ready to discover your next favourite find?
          </h2>
          <p className="relative mx-auto mb-8 max-w-xl text-white/90">
            Explore thousands of products from trusted sellers at prices you'll
            love.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4c2ed8] shadow-xl transition hover:bg-gray-100"
            >
              Start Shopping
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;