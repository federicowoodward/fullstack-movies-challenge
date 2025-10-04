import Link from "next/link";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/movies", label: "Movies" },
  { href: "/movies/new", label: "Add movie" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Movies & TV Shows
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link key={link.href} href={(link.href) as any} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
