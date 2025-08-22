"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

export default function Login() {
  const { loginData, setLoginData, resetLoginData } = useAuthStore();
  const leftPanelRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (leftPanelRef.current && window.innerWidth >= 768) {
        setPanelHeight(`${leftPanelRef.current.offsetHeight}px`);
      } else {
        setPanelHeight("auto"); // Let it flow naturally on mobile
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [loginData]);

  const handleChange = (e) => {
    setLoginData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(loginData));
    toast.success("Login successful!");
    resetLoginData();

    const input = loginData.email.toLowerCase();
    if (input === "employee") {
      window.location.href = "/dashboard/employee";
    } else if (input === "admin") {
      window.location.href = "/dashboard/admin";
    } else {
      window.location.href = "/dashboard/provider";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A1A1A]">TipTop</h1>
        <Link
          href="/"
          className="text-sm font-semibold text-[#00b74f] border border-[#00b74f] px-4 py-1 rounded-full hover:bg-[#00b74f] hover:text-white transition-all duration-200"
        >
          Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left: Login Card */}
        <div
          ref={leftPanelRef}
          className="md:flex-1 flex justify-center items-center bg-[#f9f9f9] px-4 py-10 "
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#1A1A1A]">
              Welcome Back 👋
            </h1>
            <p className="text-center text-[#666] mb-6 text-sm md:text-base">
              Log in to manage your tips, track performance and empower your
              friam.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label className="text-sm text-[#333]">Email or Name *</Label>
                <Input
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Enter your email or name"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label className="text-sm text-[#333]">Password *</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#71FF71] text-black w-full mt-4 hover:bg-[#00b74f] rounded-full py-3"
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Full Image with Overlay */}
        <div
          className="relative w-full h-[300px] md:h-auto md:flex-1"
          style={{ minHeight: panelHeight }}
        >
          <Image
            src="/waiter.png" // Replace with your actual image path
            alt="Ethiopian café worker"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center text-center px-6 text-white mt-41">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              New to TipTop?
            </h2>
            <p className="text-sm md:text-lg mb-4 max-w-md">
              Join now and start reselving indlent diigital tips, with eash *
            </p>
            <a href="/auth/signup">
              <Button className="bg-[#71FF71] text-black hover:bg-[#00b74f] w-44 rounded-full py-2">
                Sign Up
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-[#2E2E2E] text-center text-sm text-[#f1f1f1] border-t">
        © {new Date().getFullYear()} TipTop. All rights reserved.
      </footer>

      <Toaster />
    </div>
  );
}
