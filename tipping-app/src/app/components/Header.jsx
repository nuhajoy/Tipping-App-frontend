// components/Header.tsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        
        <span className="text-xl font-bold text-black ">TipTop</span>
      </div>
      <nav className="flex gap-6 text-sm font-medium text-amber-800">
        <Link href="/auth/signup">Register your business</Link>
        <Link href="/auth/login">Login</Link>
        <Link href="/send-tip">Send a Tip</Link>
      </nav>
    </header>
  );
}
