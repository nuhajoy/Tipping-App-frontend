import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-30 bg-gradient-to-br from-[#DD8849] via-[#B76D36] to-[#925224] text-white">
        <h1 className="text-4xl font-bold mb-4">
          Revolutionized Tipping for Businesses
        </h1>
        <p className="text-lg mb-6">
          Empower employees with instant digital tips. Perfect for salons,
          cafés, delivery services, and ride-hailing businesses.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signup">
            <Button
              variant="secondary"
              className="text-[#9c5A29] bg-white hover:bg-[#dbcec4]"
            >
              Register your service
            </Button>
          </Link>
          <Link href="/send-tip">
            <Button
              variant="secondary"
              className="text-[#9c5A29] bg-white hover:bg-[#dbcec4]"
            >
              Send a tip
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white mb-35">
        <h2 className="text-3xl font-semibold text-center mb-10 text-black">
          How TipTop Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 py-16 bg-white">
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
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 text-center"
            >
              <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#b87333] text-white font-bold">
                {index + 1}
              </div>
              <h3 className="text-black text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-6">{step.desc}</p>
              <Link href={step.link}>
                <Button className="bg-[#b87333] text-white rounded-full hover:bg-[#a85d2a] transition-colors">
                  {step.button}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
