"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessDescription: "",
    businessAddress: "",
    city: "",
    region: "",
    businessPhone: "",
    businessEmail: "",
    taxId: "",
    businessLicense: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    localStorage.setItem("serviceProvider", JSON.stringify(formData));
    toast.success("Registration successful! 🎉");
    router.push("/dashboard/provider");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl sm:text-3xl">
            Join TipTop as a Service Provider
          </CardTitle>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Empower your service with every tip
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                step === 1
                  ? "bg-[#b87333] text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              1
            </div>
            <div className="w-12 h-0.5 bg-gray-400" />
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                step === 2
                  ? "bg-[#b87333] text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <form className="space-y-4">
              <div>
                <Label>Business Name *</Label>
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label>Business Type *</Label>
                <Input
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="Select business type"
                  required
                />
              </div>

              <div>
                <Label>Business Description</Label>
                <Textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  placeholder="Describe your business and services"
                />
              </div>

              <div>
                <Label>Business Address *</Label>
                <Input
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <Label>Region *</Label>
                  <Input
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Select region"
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
                    value={formData.businessPhone}
                    onChange={handleChange}
                    placeholder="+251 9XX XXX XXX"
                    required
                  />
                </div>
                <div>
                  <Label>Business Email *</Label>
                  <Input
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Tax ID (Optional)</Label>
                  <Input
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Tax identification number"
                  />
                </div>
                <div>
                  <Label>Business License (Optional)</Label>
                  <Input
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleChange}
                    placeholder="Business license number"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                <Button variant="secondary" disabled>
                  Previous
                </Button>
                <Button
                  type="button"
                  className="bg-[#b87333] hover:bg-[#a85d2a]"
                  onClick={() => {
                    const requiredFields = [
                      "businessName",
                      "businessType",
                      "businessAddress",
                      "city",
                      "region",
                      "businessPhone",
                      "businessEmail",
                    ];
                    const emptyField = requiredFields.find(
                      (field) => !formData[field]?.trim()
                    );
                    if (emptyField) {
                      toast.error(
                        "Please fill all required fields before proceeding!"
                      );
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Next
                </Button>
              </div>
            </form>
          )}


          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <div>
                <Label>Confirm Password *</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}

          <div className="text-center mt-6 text-sm">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
            <a href="/" className="text-blue-600 hover:underline block mt-2">
              ← Back to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
