"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<typeof variant, string> = {
    primary:
      "bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/30 hover:bg-orange-400",
    secondary:
      "bg-slate-800 text-slate-50 border border-slate-700 hover:bg-slate-700",
    ghost:
      "bg-transparent text-slate-50/80 hover:bg-slate-800/70 border border-white/10",
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(base, variants[variant], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

