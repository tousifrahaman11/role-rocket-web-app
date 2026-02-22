import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RoleRocket – Launch Your Career",
  description:
    "RoleRocket is a modern job board and career launchpad with RocketScore ATS scoring, RoleMatch AI, and mission-control analytics for employers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 font-sans text-slate-50 antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 left-10 h-72 w-72 rounded-full bg-orange-500/30 blur-3xl" />
              <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl" />
              <div className="absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(15,23,42,0.7),_rgba(15,23,42,1))]" />
            </div>

            <Navbar />

            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
              {children}
            </main>

            <footer className="border-t border-white/10 bg-slate-950/80">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
                <p>
                  © {new Date().getFullYear()} RoleRocket. Launching careers
                  into orbit.
                </p>
                <p className="flex gap-4">
                  <span>Privacy</span>
                  <span>Terms</span>
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
