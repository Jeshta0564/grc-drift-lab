import Logo from "./Logo";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/[0.06] backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a14]/80">
      <Logo size={32} />

      <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
        <Link href="/drift-model" className="hover:text-white transition">
          Drift Model
        </Link>
        <Link href="/lab" className="hover:text-white transition">
          Lab
        </Link>
        <Link href="/dictionary" className="hover:text-white transition">
          Dictionary
        </Link>
        <Link href="/mapping" className="hover:text-white transition">
          Mapping
        </Link>
      </div>
    </nav>
  );
}
