import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#1A1A1A]">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl font-bold mb-4">
            Revolutionized Tipping for Businesses
          </h1>
          <p className="text-lg text-[#666] mb-6">
            Empower employees with instant digital tips. Perfect for salons,
            cafés, delivery services, and ride-hailing businesses.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button className="bg-[#00C853] text-white hover:bg-[#00b74f] rounded-full px-6 py-6">
                Register your service
              </Button>
            </Link>
            <Link href="/send-tip">
              <Button className="bg-[#F5F5F5] text-[#00C853] hover:bg-[#e0e0e0] rounded-full px-6 py-6 border border-[#00C853]">
                Send a tip
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/landingpage.jpg"
            alt="Employees using TipTop"
            width={500}
            height={400}
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-[2px] bg-gradient-to-r from-[#00C853] via-[#00b74f] to-[#00C853] rounded-full"></div>
        </div>

        <h2 className="text-3xl font-semibold text-center mb-10 text-[#1A1A1A]">
          How TipTop Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          {[
            {
              title: "Register Your Business",
              desc: "Sign up and add your employees to the platform. Each gets a unique tipping code.",
              button: "Register your service",
              link: "/auth/signup",
            },
            {
              title: "Share the Code",
              desc: "Employees share their unique codes with customers after providing service.",
              button: "Ask For a Code",
              link: "/auth/login",
            },
            {
              title: "Instant Tipping",
              desc: "Customers enter the code, choose amount, and pay securely through Chapa.",
              button: "Send A Tip",
              link: "/send-tip",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-md p-10 text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#00C853] text-white font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
                {step.title}
              </h3>
              <p className="text-[#666] mb-6">{step.desc}</p>
              <Link href={step.link}>
                <Button className="bg-[#00C853] text-white rounded-full hover:bg-[#00b74f] transition-colors px-4 py-2">
                  {step.button}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose TipTop Section */}

      <section className="py-20 bg-[#F9F9F9] px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10 text-[#1A1A1A]">
          Why Choose TipTop?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Fast Payments",
              desc: "Employees receive their tips instantly through secure digital transactions, eliminating delays and boosting financial confidence. With real-time payouts via Chapa, your team can access earnings without waiting for payroll cycles or manual cash handling.",
            },
            {
              title: "Easy to Use",
              desc: "TipTop is designed for simplicity. Employees get a unique code, customers enter it, and tips are sent instantly. No apps to download, no complex setup — just a clean, intuitive experience that works across devices and services. Perfect for teams with limited tech exposure.",
            },
            {
              title: "Boost Motivation",
              desc: "When employees see immediate rewards for great service, morale skyrockets. TipTop helps foster a culture of appreciation and performance. Happy staff lead to happier customers, which means better reviews, repeat business, and a stronger brand reputation.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#00C853] mb-4">
                {item.title}
              </h3>
              <p className="text-[#666] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
          Ready to Transform Your Business?
        </h2>
        <Link href="/auth/signup">
          <Button className="bg-[#00C853] text-white px-6 py-3 rounded-full hover:bg-[#00b74f] transition-colors">
            Get Started Today
          </Button>
        </Link>
      </section>

      <Footer />
    </main>
  );
}
