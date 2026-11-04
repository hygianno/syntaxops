import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Syntax_Ops — Proof of Work Engineering Platform",
    template: "%s — Syntax_Ops",
  },
  description:
    "Learn cloud engineering, DevOps, and software development through practical projects, real-world challenges, and verifiable proof of work. Built for African engineers.",
  keywords: ["cloud engineering", "DevOps", "AWS", "Kubernetes", "proof of work", "Africa tech"],
  openGraph: {
    title: "Syntax_Ops",
    description: "Hands-on engineering education for the next generation of African cloud engineers.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
