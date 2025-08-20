"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const { loginData, setLoginData, resetLoginData } = useAuthStore();
  const leftPanelRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (leftPanelRef.current) {
        setPanelHeight(`${leftPanelRef.current.offsetHeight}px`);
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
    <div className="flex justify-center items-center min-h-screen bg-primary text-secondary gap-0 flex-col md:flex-row">
      <div
        ref={leftPanelRef}
        className="flex-[0.6] flex flex-col justify-center items-center p-8 bg-primary border border-secondary rounded-l-2xl shadow-md"
        style={{ minHeight: panelHeight }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-6">
            Login to TipTop
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Email or Name *</Label>
              <Input
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your email or name"
                className="!shadow-none !focus:ring-0 !focus:outline-none focus:border-accent"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="!shadow-none !focus:ring-0 !focus:outline-none focus:border-accent"
                required
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="bg-accent text-secondary w-full mt-4 hover:opacity-90"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
      <div
        className="hidden md:flex flex-[0.4] flex-col justify-center items-center bg-secondary p-12 gap-6 rounded-r-2xl border border-secondary text-center"
        style={{ minHeight: panelHeight }}
      >
        <p className="text-white text-lg font-semibold">
          Don't have an account? register to make tipping easier!
        </p>
        <a href="/auth/signup">
          <Button className="bg-accent text-secondary hover:opacity-90 w-44">
            Sign Up
          </Button>
        </a>
      </div>
      <Toaster />
    </div>
  );
}
