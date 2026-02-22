"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    title: "RocketScore",
    subtitle: "ATS scoring",
    description:
      "Instantly benchmark your resume against real job descriptions with an ATS-friendly RocketScore.",
    pill: "Resume intelligence",
  },
  {
    title: "RoleMatch AI",
    subtitle: "Smart matching",
    description:
      "Get a ranked list of roles and companies where your skills have the best launch trajectory.",
    pill: "AI matching",
  },
  {
    title: "Rocket Alerts",
    subtitle: "Job alerts",
    description:
      "Stay one step ahead with skill-aware alerts that surface roles before everyone else.",
    pill: "Proactive search",
  },
  {
    title: "Mission Control",
    subtitle: "Analytics",
    description:
      "Employers get mission dashboards with funnel analytics and skill heatmaps that actually guide hiring.",
    pill: "Employer insights",
  },
];

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 sm:py-10 lg:py-14">
      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-200 shadow-sm shadow-orange-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span>New · AI-native job board SaaS</span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Launch Your Career{" "}
              <span className="text-gradient align-middle">🚀</span>
            </h1>
            <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              RoleRocket is a modern job board and analytics platform that
              scores your resume, matches you with roles, and gives employers a
              mission-control view of their hiring funnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/register">
              <Button>Launch your career</Button>
            </Link>
            <Link href="#pricing">
              <Button variant="ghost" className="border border-white/10">
                View pricing
              </Button>
            </Link>
            <p className="text-xs text-slate-400">
              No credit card required · Ship-ready SaaS
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>RocketScore ATS · RoleMatch AI · Rocket Alerts</span>
            </div>
          </div>
        </div>

        <div className="rocket-orbit relative">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="glass-panel gradient-border relative mx-auto max-w-md px-6 py-6 sm:px-8 sm:py-7"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Candidate cockpit
                </p>
                <p className="text-sm text-slate-200">
                  Live view of your career orbit.
                </p>
              </div>
              <motion.div
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-sky-400 to-blue-500 shadow-lg shadow-orange-500/50"
                animate={{ y: [-6, 4, -6], rotate: [-4, 4, -4] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-2xl">🚀</span>
              </motion.div>
            </div>

            <div className="space-y-4 text-xs text-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="card-soft p-3">
                  <p className="text-[11px] text-slate-400">RocketScore</p>
                  <p className="mt-1 text-2xl font-semibold text-orange-300">
                    86<span className="text-xs text-slate-400">/100</span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Strong match for Product + Frontend roles.
                  </p>
                </div>
                <div className="card-soft p-3">
                  <p className="text-[11px] text-slate-400">RoleMatch AI</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">
                    12 high-orbit matches
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    4 startups · 3 scaleups · 5 remote-first.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-300">
                    Visibility
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-200">
                    +42%
                  </p>
                  <p className="mt-1 text-[10px] text-emerald-100/80">
                    More recruiter views.
                  </p>
                </div>
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-sky-200">
                    Match rate
                  </p>
                  <p className="mt-1 text-lg font-semibold text-sky-100">
                    3.4×
                  </p>
                  <p className="mt-1 text-[10px] text-sky-100/80">
                    Better role alignment.
                  </p>
                </div>
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-orange-100">
                    Time saved
                  </p>
                  <p className="mt-1 text-lg font-semibold text-orange-100">
                    8h/wk
                  </p>
                  <p className="mt-1 text-[10px] text-orange-100/80">
                    Automated search.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-section space-y-8 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-8 shadow-[0_18px_60px_rgba(15,23,42,0.9)] sm:px-8 lg:px-10"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="tag-pill mb-3">Why teams choose RoleRocket</p>
            <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
              Mission-grade features for candidates and employers.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              From ATS-aware resume scoring to AI-powered matching and hiring
              analytics, RoleRocket feels like a funded startup out of the box.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, idx) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: idx * 0.06, duration: 0.45 }}
              className="card-soft group relative overflow-hidden p-4"
            >
              <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-slate-700/20 via-slate-900/0 to-sky-500/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-3">
                <p className="badge-soft text-[10px] uppercase tracking-[0.18em] text-slate-300">
                  {card.subtitle}
                </p>
                <h3 className="text-sm font-semibold text-slate-50">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {card.description}
                </p>
                <p className="inline-flex items-center text-[11px] font-medium text-slate-300">
                  <span className="mr-1.5 h-1 w-4 rounded-full bg-gradient-to-r from-orange-500 to-sky-400" />
                  {card.pill}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-section grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
      >
        <div className="space-y-4">
          <p className="tag-pill">Pricing</p>
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">
            Simple, transparent plans for candidates and teams.
          </h2>
          <p className="max-w-xl text-sm text-slate-400">
            Start free, then upgrade when you want mission control analytics,
            collaborative hiring, and advanced AI feedback.
          </p>

          <ul className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-[3px] text-emerald-400">●</span>
              <span>Unlimited applications and saved jobs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] text-sky-400">●</span>
              <span>RocketScore ATS scoring on every upload.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] text-orange-400">●</span>
              <span>RoleMatch AI for tailored job recommendations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] text-violet-400">●</span>
              <span>Mission Control analytics for hiring teams.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="glass-panel grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            <div>
              <p className="text-xs font-medium text-slate-300">Free</p>
              <p className="mt-1 text-2xl font-semibold text-slate-50">$0</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Great for actively searching candidates.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-orange-300">Pro</p>
              <p className="mt-1 text-2xl font-semibold text-orange-200">
                $19
                <span className="text-xs text-slate-400"> /month</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Advanced RoleMatch AI and resume feedback.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-sky-300">Enterprise</p>
              <p className="mt-1 text-2xl font-semibold text-sky-100">
                Let&apos;s talk
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Mission control analytics for full hiring teams.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-5 text-xs text-slate-300"
          >
            <p className="font-medium text-slate-100">
              “RoleRocket feels like we hired a full-time recruiting ops team.
              Our applicants are better matched, and hiring managers finally
              have a view of the pipeline that isn&apos;t a spreadsheet.”
            </p>
            <p className="mt-3 text-[11px] font-medium text-slate-400">
              — Head of Talent, Series B SaaS company
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
