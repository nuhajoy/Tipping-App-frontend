"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const {
    step,
    nextStep,
    prevStep,
    signupData,
    setSignupData,
    resetSignupData,
    panelHeight,
    setPanelHeight,
  } = useAuthStore();

  const rightPanelRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (rightPanelRef.current) {
        setPanelHeight(`${rightPanelRef.current.offsetHeight}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [step, setPanelHeight]);

  const handleChange = (e) => {
    setSignupData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("serviceProviders") || "[]");
    const dataArray = Array.isArray(existing) ? existing : [existing];
    const updated = [...dataArray, signupData];

    localStorage.setItem("serviceProviders", JSON.stringify(updated));

    toast.success("Registration successful! Redirecting to dashboard...");
    resetSignupData();

    window.location.href =
      "/auth/verify";

  };

  const handleNextStep = () => {
    const requiredFields = [
      "businessName",
      "businessType",
      "businessAddress",
      "city",
      "region",
      "businessPhone",
      "businessEmail",
    ];
    const emptyField = requiredFields.find((field) => !signupData[field]?.trim());

    if (emptyField) {
      toast.error("Please fill all required fields before proceeding!");
      return;
    }

    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className="hidden md:flex flex-[0.4] relative p-12 justify-center items-center bg-cover bg-center rounded-l-2xl"
        style={{ backgroundImage: "url('/backgroundAuth.jpg')", height: panelHeight }}
      >
        <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.push("/")}>
          <ArrowLeft className="w-6 h-6 text-white hover:text-accent transition" />
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-lg font-semibold text-white">
            Already registered as a service provider?
          </p>
          <a href="/auth/login">
            <Button className="bg-accent text-secondary hover:opacity-90 w-44">
              Sign In
            </Button>
          </a>
        </div>
      </div>
      <div
        ref={rightPanelRef}
        className="flex-[0.6] flex flex-col justify-center p-12 bg-muted"
        style={{ height: panelHeight }}
      >
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Business Name *</Label>
                <Input
                  name="businessName"
                  value={signupData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  required
                />
              </div>
              <div>
                <Label>Business Type *</Label>
                <Input
                  name="businessType"
                  value={signupData.businessType}
                  onChange={handleChange}
                  placeholder="Select business type"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Business Address *</Label>
                <Input
                  name="businessAddress"
                  value={signupData.businessAddress}
                  onChange={handleChange}
                  placeholder="Business address"
                  required
                />
              </div>
              <div>
                <Label>City *</Label>
                <Input
                  name="city"
                  value={signupData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Region *</Label>
                <Input
                  name="region"
                  value={signupData.region}
                  onChange={handleChange}
                  placeholder="Select region"
                  required
                />
              </div>
              <div>
                <Label>Business Phone *</Label>
                <Input
                  type="tel"
                  name="businessPhone"
                  value={signupData.businessPhone}
                  onChange={handleChange}
                  placeholder="+251 9XX XXX XXX"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Business Email *</Label>
                <Input
                  type="email"
                  name="businessEmail"
                  value={signupData.businessEmail}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  required
                />
              </div>
              <div>
                <Label>Tax ID (Optional)</Label>
                <Input
                  name="taxId"
                  value={signupData.taxId}
                  onChange={handleChange}
                  placeholder="Tax identification number"
                />
              </div>
            </div>
            <div>
              <Label>Business Description</Label>
              <Textarea
                name="businessDescription"
                value={signupData.businessDescription}
                onChange={handleChange}
                placeholder="Describe your business and services"
              />
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

      <Toaster />
    </div>
  );
}
