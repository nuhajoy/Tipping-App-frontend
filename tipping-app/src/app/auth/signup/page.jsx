"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export default function Signup() {
  const {
    step,
    nextStep,
    prevStep,
    signupData,
    setSignupData,
    resetSignupData
  } = useAuthStore();

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (rightPanelRef.current) {
        const offset = step === 2 ? 50 : 0;
        setLeftHeight(`${rightPanelRef.current.offsetHeight - offset}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [step]); 

  const handleChange = (e) => {
    setSignupData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("serviceProvider") || "[]");
    const dataArray = Array.isArray(existing) ? existing : [existing];
    const updated = [...dataArray, signupData];

    localStorage.setItem("serviceProvider", JSON.stringify(updated));
    
    toast.success("Registration successful! You will now be redirected to your dashboard.");
    resetSignupData();
    window.location.href = "/dashboard/provider";
  };

  const handleNextStep = () => {
    const requiredFields = [
      "businessName", "businessType", "businessAddress", "city", "region", "businessPhone", "businessEmail"
    ];
    const emptyField = requiredFields.find((field) => !signupData[field]?.trim());
    
    if (emptyField) {
      toast.error("Please fill all required fields before proceeding!");
      return;
    }
    
    nextStep(); 
  };

  return (
    <div className="flex min-h-screen bg-primary text-secondary gap-0 flex-col md:flex-row">
      <div
        ref={leftPanelRef}
        className="hidden md:flex flex-col justify-center items-center bg-secondary flex-[0.3] p-12 gap-8 rounded-l-2xl shadow-lg relative overflow-hidden"
        style={{ height: leftHeight }}
      >
        <div className="text-center text-white px-4">
          <p className="text-lg font-semibold">
            Already registered as a service provider?
          </p>
        </div>
        <a href="/auth/login" className="mt-4">
          <Button className="bg-accent text-secondary hover:opacity-90 w-44">
            Sign In
          </Button>
        </a>
      </div>

      <div
        ref={rightPanelRef}
        className="flex-[0.7] flex flex-col justify-start items-center p-12 rounded-r-2xl bg-primary shadow-2xl border border-secondary ring-1 ring-secondary/30"
      >
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Join TipTop as a Service Provider
            </h1>
            <p className="text-sm sm:text-base text-secondary/70 mt-2">
              Empower your service with every tip
            </p>
          </div>
          <div className="flex items-center justify-center mb-8 gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                step >= 1 ? "bg-accent text-secondary" : "bg-secondary text-primary"
              }`}
            >
              1
            </div>
            <div
              className={`w-8 h-0.5 ${step > 1 ? "bg-accent" : "bg-secondary/40"}`}
            />
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                step >= 2 ? "bg-accent text-secondary" : "bg-secondary text-primary"
              }`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { label: "Business Name *", name: "businessName" },
                { label: "Business Type *", name: "businessType" },
                { label: "Business Description", name: "businessDescription", textarea: true },
                { label: "Business Address *", name: "businessAddress" },
              ].map((field, idx) =>
                field.textarea ? (
                  <div key={idx}>
                    <Label>{field.label}</Label>
                    <Textarea
                      name={field.name}
                      value={signupData[field.name]}
                      onChange={handleChange}
                      placeholder="Describe your business and services"
                      className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    />
                  </div>
                ) : (
                  <div key={idx}>
                    <Label>{field.label}</Label>
                    <Input
                      name={field.name}
                      value={signupData[field.name]}
                      onChange={handleChange}
                      placeholder={field.label.includes("Name") ? "Enter your business name" : "Select business type"}
                      className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                      required
                    />
                  </div>
                )
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    name="city"
                    value={signupData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    required
                  />
                </div>
                <div>
                  <Label>Region *</Label>
                  <Input
                    name="region"
                    value={signupData.region}
                    onChange={handleChange}
                    placeholder="Select region"
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Business Phone *</Label>
                  <Input
                    type="tel"
                    name="businessPhone"
                    value={signupData.businessPhone}
                    onChange={handleChange}
                    placeholder="+251 9XX XXX XXX"
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    required
                  />
                </div>
                <div>
                  <Label>Business Email *</Label>
                  <Input
                    type="email"
                    name="businessEmail"
                    value={signupData.businessEmail}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Tax ID (Optional)</Label>
                  <Input
                    name="taxId"
                    value={signupData.taxId}
                    onChange={handleChange}
                    placeholder="Tax identification number"
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                <Button variant="secondary" disabled>
                  Previous
                </Button>
                <Button
                  type="button"
                  className="bg-accent text-secondary hover:opacity-90"
                  onClick={handleNextStep} 
                >
                  Next
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {["password", "confirmPassword"].map((field) => (
                <div key={field}>
                  <Label>{field === "password" ? "Password *" : "Confirm Password *"}</Label>
                  <Input
                    type="password"
                    name={field}
                    value={signupData[field]}
                    onChange={handleChange}
                    placeholder={field === "password" ? "Create a strong password" : "Confirm your password"}
                    className="!shadow-none !ring-0 !focus:ring-0 !focus:shadow-none"
                    required
                  />
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                <Button type="button" variant="secondary" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit" className="bg-accent text-secondary hover:opacity-90">
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}