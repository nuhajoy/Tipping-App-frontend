// components/Footer.tsx
import Link from "next/link";
import "../globals.css"; // Ensure global styles are imported

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "rgba(45, 55, 72)" }}
      className="px-30 py-17 mt-12 mb-0 text-sm "
    >
      <div className="mt-0 py-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 ">
        <div>
          <h2 className="text-lg font-bold text-white ">TipTop</h2>
          <p className="mt-2 max-w-sm text-gray font-light">
            Revolutionizing the tipping experience for service industries across
            Ethiopia.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h3 className="font-bold mb-2 text-lg">Product</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/auth/signup">Register your business</Link>
              </li>
              <li>
                <Link href="/send-tip">Send a tip</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-lg">Support</h3>
            <ul className="space-y-1 text-gray-300">
              <li>
                <Link href="/help">Help Center</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        
        className=" py-6 border-t border-gray-700 mt-8 text-center text-blue-400"
      >
        <hr />
      </div>
      <div className=" py-12 text-center text-sm text-white-500">
        © {new Date().getFullYear()} TipTop. All rights reserved.
      </div>
    </footer>
  );
}
