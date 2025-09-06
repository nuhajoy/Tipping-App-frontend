"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending verification request
    try {
      // Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus("sent");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center space-y-4">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">
          Verify Your Email
        </h2>
        <p className="text-sm text-[#666]">
          Enter your registered email to receive a verification link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-[#DDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853]"
          />
          <Button
            type="submit"
            variant="default"
            className="w-full bg-[#00C853] text-white hover:bg-[#009624]"
          >
            Send Verification Link
          </Button>
        </form>

        {status === "sending" && (
          <p className="text-[#666] text-sm">Sending verification link...</p>
        )}
        {status === "sent" && (
          <p className="text-[#00C853] font-medium text-sm">
            ✅ Link sent! Please check your inbox.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 font-medium text-sm">
            ❌ Failed to send. Try again later.
          </p>
        )}

        <Button
          variant="ghost"
          className="mt-2 text-sm text-[#00C853] underline"
          onClick={() => router.push("/auth/login")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}
