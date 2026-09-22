import { useState } from "react";
import {
  BookOpen,
  Clock,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Rss,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

const POSTS = [
  {
    id: 1,
    category: "Shopping Tips",
    title: "10 proven ways to save more on every online order",
    excerpt:
      "From coupon stacking to the right time to buy — these small habits can slash your monthly shopping bill without cutting down on the things you love.",
    date: "Sep 18, 2026",
    readTime: "5 min read",
    gradient: "from-[#4c2ed8] to-[#368de8]",
    icon: "💡",
    body: [
      "Online shopping is convenient, but a little strategy goes a long way. Start by making a list before you browse — impulse buys are the biggest budget killers. Then, always compare prices across the categories you shop in and check for exclusive app-only deals.",
      "Timing matters too. Most sellers refresh pricing during festive sales and end-of-season clearances. If you can wait, adding items to your wishlist and purchasing them during a sale window can save you 30–50% on the same product.",
      "Finally, never pay full price for shipping. Look for free delivery thresholds, club multiple items into a single order, and always apply reward points or voucher codes at checkout. Small savings add up fast — most shoppers save 15–25% every month just by following these rules.",
    ],
  },
  {
    id: 2,
    category: "Product Guides",
    title: "How to pick the perfect smartphone without overpaying",
    excerpt:
      "Processor, camera, battery — what actually matters for your budget? A no-jargon guide to buying your next phone in 2026.",
    date: "Sep 12, 2026",
    readTime: "7 min read",
    gradient: "from-[#f97316] to-[#f59e0b]",
    icon: "📱",
    body: [
      "A smartphone is a long-term investment, and you don't need the most expensive model to be happy. Define what you actually do: gaming? photography? day-to-day apps? Let your usage drive the decision, not the hype.",
      "In the mid-range segment, look for a capable chip paired with at least 8GB of RAM and a battery above 5000mAh. Camera specs alone rarely tell the full story — check real-world photo samples instead of megapixel numbers.",
      "Buy from verified sellers to guarantee genuine devices and warranty coverage. And remember, last year's flagship is often dramatically cheaper than this year's mid-ranger while performing just as well for daily use.",
    ],
  },
  {
    id: 3,
    category: "Style & Fashion",
    title: "The smart wardrobe: build timeless looks on any budget",
    excerpt:
      "Trends fade, but a few versatile staples never do. Learn how to build a capsule wardrobe that looks expensive without costing it.",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    gradient: "from-[#d946ef] to-[#8b5cf6]",
    icon: "👕",
    body: [
      "A capsule wardrobe means owning fewer, better pieces that all mix and match. Start with neutral essentials — a great pair of jeans, a crisp white shirt, and one versatile jacket. These anchor every outfit.",
      "Invest the bulk of your budget in items you wear constantly, and save on seasonal pieces that you'll rotate quickly. When shopping, check fabric composition and stitching quality rather than just the label.",
      "Finally, dress according to fit, not size. A well-fitted affordable outfit always beats a designer piece that doesn't sit right. Study your own proportions and buy with confidence.",
    ],
  },
  {
    id: 4,
    category: "Seller Stories",
    title: "Meet Priya: from home kitchen to a thriving online store",
    excerpt:
      "How one home chef used ShopEase's seller platform to turn a small kitchen into a beloved brand loved by thousands of customers.",
    date: "Aug 28, 2026",
    readTime: "4 min read",
    gradient: "from-[#10b981] to-[#22c55e]",
    icon: "🧑‍🍳",
    body: [
      "Priya started small — a handful of homemade snacks sold to friends and family. When her neighbours asked if she could deliver, she realised she needed a bigger stage: the internet.",
      "Within two months of listing on ShopEase, her store was receiving dozens of orders a day. High-quality photography and honest product descriptions made all the difference, she says.",
      "Today Priya's brand ships across the country. Her advice to aspiring sellers: start with one hero product, nail the basics of quality and delivery, and let customer reviews do the marketing for you.",
    ],
  },
  {
    id: 5,
    category: "Seasonal Deals",
    title: "Festive season essentials: our guide to the best deals",
    excerpt:
      "Everything you need to make the most of the biggest sale of the year — what to buy, when to buy, and how to avoid the traps.",
    date: "Aug 20, 2026",
    readTime: "5 min read",
    gradient: "from-[#ef4444] to-[#f97316]",
    icon: "🎁",
    body: [
      "The festive season is the perfect time to upgrade big-ticket items — electronics, appliances, and furniture frequently see their lowest prices of the year.",
      "Set a budget and stick to it. Make a priority list of items you genuinely need, check early-bird previews, and use EMI options thoughtfully so they don't sneak up monthly payments on you.",
      "Compare final prices during flash sales and double-check bank-card offers that stack on top of seller discounts. A little planning turns the season from a spending spree into real savings.",
    ],
  },
  {
    id: 6,
    category: "Guides",
    title: "Returns, refunds & replacements explained in plain English",
    excerpt:
      "Return windows, timelines, and what 'picked up' really means — everything you need so returns never feel stressful again.",
    date: "Aug 10, 2026",
    readTime: "4 min read",
    gradient: "from-[#0ea5e9] to-[#6366f1]",
    icon: "↩️",
    body: [
      "Returns sound complicated, but the process is designed to be painless. When an item arrives damaged, incorrect, or simply not as expected, start a return from your orders page in a few taps.",
      "Keep the product in its original packaging with tags attached — this speeds up verification and refunds. Most pickups happen within 24–48 hours, and refunds follow shortly after inspection.",
      "Still unsure about a rule? The FAQ page covers common scenarios, and our support team is happy to walk you through any specific case step by step.",
    ],
  },
];

const CATEGORY_CHIPS = [
  "All",
  ...Array.from(new Set(POSTS.map((p) => p.category))),
];

function Blog() {
  const navigate = useNavigate();
  const [activePost, setActivePost] = useState(null);
  const [filter, setFilter] = useState("All");

  const visiblePosts =
    filter === "All" ? POSTS : POSTS.filter((p) => p.category === filter);

  const selected = activePost ? POSTS.find((p) => p.id === activePost) : null;

  if (selected) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          <button
            onClick={() => setActivePost(null)}
            className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#4c2ed8] hover:text-[#4c2ed8]"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </button>

          <div
            className={`mb-6 flex h-52 items-center justify-center rounded-3xl bg-gradient-to-br ${selected.gradient} text-6xl shadow-lg shadow-black/10`}
          >
            <span>{selected.icon}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="rounded-full bg-[#4c2ed8]/10 px-3 py-1 font-semibold text-[#4c2ed8]">
              {selected.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {selected.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {selected.readTime}
            </span>
          </div>

          <h1 className="mb-6 mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {selected.title}
          </h1>

          <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
            {selected.body.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="text-base leading-relaxed text-gray-600"
              >
                {para}
              </p>
            ))}
            <div className="rounded-2xl bg-[#4c2ed8]/5 p-6">
              <p className="text-sm text-gray-600">
                Thank you for reading! If you found this helpful, explore more
                guides on our{" "}
                <button
                  onClick={() => setActivePost(null)}
                  className="font-semibold text-[#4c2ed8] hover:underline"
                >
                  blog
                </button>{" "}
                or start shopping{" "}
                <button
                  onClick={() => navigate("/home")}
                  className="font-semibold text-[#4c2ed8] hover:underline"
                >
                  right now
                </button>
                .
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <BookOpen size={14} />
            ShopEase Blog
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Tips, stories & smart shopping guides
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90">
            Honest advice and practical ideas to help you shop smarter, save
            more, and enjoy the journey.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_CHIPS.map((chip) => {
            const active = filter === chip;
            return (
              <button
                key={chip}
                onClick={() => setFilter(chip)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#4c2ed8] text-white shadow-lg shadow-[#4c2ed8]/25"
                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActivePost(post.id)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70"
            >
              <div
                className={`flex h-44 items-center justify-center bg-gradient-to-br ${post.gradient} text-5xl`}
              >
                <span className="transition-transform duration-300 group-hover:scale-125">
                  {post.icon}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                  <span className="rounded-full bg-[#4c2ed8]/10 px-3 py-1 font-semibold text-[#4c2ed8]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h2 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition group-hover:text-[#4c2ed8]">
                  {post.title}
                </h2>
                <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[#4c2ed8]">
                    Read More
                    <ChevronRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visiblePosts.length === 0 && (
          <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No articles in this category yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Subscribe strip */}
      <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8] p-10 text-center shadow-xl shadow-[#4c2ed8]/20 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Rss size={26} className="text-white" />
          </div>
          <h2 className="relative mb-3 text-2xl font-bold text-white sm:text-3xl">
            Never miss a new guide
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/90">
            Follow the blog for fresh shopping tips, product round-ups, and
            seller stories delivered straight to you.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4c2ed8] shadow-xl transition hover:bg-gray-100"
          >
            Start Shopping
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;