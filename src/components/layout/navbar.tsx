"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/jobs", label: "Jobs" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 via-sky-400 to-blue-500 shadow-lg shadow-orange-500/40">
            <span className="text-lg font-black text-slate-950">R</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-50">
              RoleRocket
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Launch Your Career
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace("#", ""));

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative inline-flex items-center"
              >
                <span
                  className={`transition-colors ${
                    isActive ? "text-slate-50" : "text-slate-400"
                  }`}
                >
                  {link.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-orange-500 to-sky-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 shadow-sm shadow-slate-900/40 transition hover:bg-slate-800/80 hover:text-slate-50"
          >
            <motion.span
              key={theme}
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </motion.span>
          </button>

          <Link href="/login">
            <Button variant="ghost" className="hidden text-xs md:inline-flex">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button className="text-xs" variant="primary">
              Launch Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

