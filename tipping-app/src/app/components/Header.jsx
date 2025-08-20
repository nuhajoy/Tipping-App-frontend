import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-20 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="text-xl font-bold text-black">TipTop</div>

      {/* Navigation */}
      <nav className="flex items-center gap-6 text-sm font-medium text-[#1A1A1A]">
        <Link
          href="/auth/login"
          className="hover:text-[#00C853] transition-colors"
        >
          Login
        </Link>
        <Link
          href="/send-tip"
          className="hover:text-[#00C853] transition-colors"
        >
          Send a Tip
        </Link>
        <Link href="/auth/signup">
          <Button className="bg-[#00C853] text-white hover:bg-[#00b74f] rounded-full px-4 py-2 text-sm">
            Register your service
          </Button>
        </Link>
      </nav>
    </header>
  );
}
