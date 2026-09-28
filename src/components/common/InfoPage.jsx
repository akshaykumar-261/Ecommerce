import { ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/*
 * Shared shell for the static information pages (help, shipping, returns,
 * privacy) so the hero, the on-page table of contents and the closing CTA stay
 * identical across all of them.
 */
function InfoPage({ badge, title, subtitle, icon: Icon, sections, ctaTitle, ctaText }) {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center lg:px-8 lg:py-20">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Icon size={14} />
            {badge}
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4">
            {sections.map(({ id, title: sectionTitle, icon: SectionIcon, intro, items, note }) => (
              <article
                key={id}
                id={id}
                className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-200/60 sm:p-8"
              >
                <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-gray-800 sm:text-xl">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4c2ed8] to-[#365fe0] text-white shadow-lg shadow-[#4c2ed8]/20">
                    <SectionIcon size={18} />
                  </span>
                  {sectionTitle}
                </h2>

                {intro && (
                  <p className="mb-4 text-sm leading-relaxed text-gray-500">
                    {intro}
                  </p>
                )}

                {items?.length ? (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4c2ed8]" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-500">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {note && (
                  <p className="mt-5 rounded-xl border border-[#4c2ed8]/15 bg-[#f4f3ff] px-4 py-3 text-xs leading-relaxed text-[#4c2ed8]">
                    {note}
                  </p>
                )}
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav
              aria-label="On this page"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                On this page
              </p>
              <ul className="space-y-1">
                {sections.map(({ id, title: sectionTitle }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="group flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-[#f4f3ff] hover:text-[#4c2ed8]"
                    >
                      <ChevronRight
                        size={14}
                        className="shrink-0 text-gray-300 transition-colors group-hover:text-[#4c2ed8]"
                      />
                      {sectionTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-800">
                Need more help?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Our support team replies within 24 hours.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#365fe0] px-4 text-xs font-bold text-white shadow-lg shadow-[#4c2ed8]/20 transition hover:shadow-xl"
              >
                Contact Support
                <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c2ed8] via-[#3f3ad8] to-[#368de8] p-10 text-center shadow-xl shadow-[#4c2ed8]/20 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <MessageCircle size={26} className="text-white" />
          </div>
          <h2 className="relative mb-3 text-2xl font-bold text-white sm:text-3xl">
            {ctaTitle}
          </h2>
          <p className="relative mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/90">
            {ctaText}
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#4c2ed8] shadow-xl transition hover:bg-gray-100"
            >
              Contact Support
            </Link>
            <Link
              to="/home"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InfoPage;
