"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [panelHeight, setPanelHeight] = useState("100vh");
  const [loading, setLoading] = useState(false);

  const rightPanelRef = useRef(null);
  const fileInputRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [signupData, setSignupData] = useState({
    businessName: "",
    businessType: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    city: "",
    region: "",
    taxId: "",
    businessDescription: "",
    imageUrl: "",
    license: null,
    licenseName: "",
    password: "",
    confirmPassword: "",
  });

  
  useEffect(() => {
    axios
      .get(`${apiUrl}/categories`, { responseType: "text" })
      .then((res) => {
        const raw = res.data;
        const cleaned = raw.substring(raw.indexOf("["));
        let parsed = [];
        try {
          parsed = JSON.parse(cleaned);
        } catch (e) {
          console.error("Failed to parse categories:", e);
          setCategoriesError("Failed to parse categories");
        }
        setCategories(parsed);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategoriesError("Unable to load categories. Please try again later.");
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  
  useEffect(() => {
    const updateHeight = () => {
      if (rightPanelRef.current) {
        setPanelHeight(`${rightPanelRef.current.offsetHeight}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [step]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "license") {
      if (files && files.length > 0) {
        setSignupData((prev) => ({
          ...prev,
          license: files[0],
          licenseName: files[0].name,
        }));
      }
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    const requiredFields = [
      "businessName",
      "businessType",
      "businessEmail",
      "businessPhone",
      "businessAddress",
      "city",
      "region",
      "taxId",
      "businessDescription",
      "license",
    ];
    const emptyField = requiredFields.find((f) => !signupData[f]);
    if (emptyField) {
      toast.error("Please fill all required fields before proceeding!");
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (signupData.password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      setLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (signupData.license && signupData.license.size > 5 * 1024 * 1024) {
      toast.error("License file must be under 5MB.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const provider_data = {
      name: signupData.businessName,
      category_id: signupData.businessType,
      email: signupData.businessEmail,
      password: signupData.password,
      contact_phone: signupData.businessPhone,
      tax_id: signupData.taxId,
      description: signupData.businessDescription,
      address: {
        street_address: signupData.businessAddress,
        city: signupData.city,
        region: signupData.region,
      },
      image_url: signupData.imageUrl,
    };
    formData.append("provider_data", JSON.stringify(provider_data));
    if (signupData.license) formData.append("license", signupData.license);

    try {
      const res = await axios.post(
        `${apiUrl}/service-providers/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(
        res.data.message || "Registration successful! Check your email."
      );
      setSignupData({
        businessName: "",
        businessType: "",
        businessEmail: "",
        businessPhone: "",
        businessAddress: "",
        city: "",
        region: "",
        taxId: "",
        businessDescription: "",
        imageUrl: "",
        license: null,
        licenseName: "",
        password: "",
        confirmPassword: "",
      });
      router.push("/auth/verify");
    } catch (err) {
      console.error(err);
      const fallback =
        err.response?.data?.error || err.message || "Registration failed.";
      const errors = err.response?.data?.errors;
      if (errors) {
        toast.error(Object.values(errors).flat().join(", "));
      } else {
        toast.error(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div
        className="hidden md:flex flex-[0.4] relative p-12 justify-center items-center bg-cover bg-center rounded-l-2xl"
        style={{
          backgroundImage: "url('/waiter.png')",
          height: panelHeight,
        }}
      >
        <div
          className="absolute top-4 left-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-6 h-6 text-white hover:text-accent transition" />
        </div>
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-lg font-semibold text-white">
            Already registered as a service provider?
          </p>
          <a href="/auth/login">
            <button className="bg-accent text-white hover:bg-secondary w-44 py-2 rounded">
              Sign In
            </button>
          </a>
        </div>
      </div>
      <div
        ref={rightPanelRef}
        className="flex-[0.6] flex flex-col justify-center p-6 bg-white overflow-y-auto"
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black">
            Join TipTop as a Service Provider
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Empower your service with every tip
          </p>
        </div>

        <div className="flex items-center justify-center mb-8 gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
              step >= 1 ? "bg-accent text-white" : "bg-gray-300 text-black"
            }`}
          >
            1
          </div>
          <div className={`w-8 h-0.5 ${step > 1 ? "bg-accent" : "bg-gray-300"}`} />
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
              step >= 2 ? "bg-accent text-white" : "bg-gray-300 text-black"
            }`}
          >
            2
          </div>
        </div>

        {step === 1 && (
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-black">Business Name *</label>
                <input
                  name="businessName"
                  value={signupData.businessName || ""}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">Business Type *</label>
                <select
                  name="businessType"
                  value={signupData.businessType || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                  disabled={categoriesLoading || !!categoriesError}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : categoriesError
                      ? categoriesError
                      : "Select Category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-black">Business Email *</label>
                <input
                  name="businessEmail"
                  type="email"
                  value={signupData.businessEmail || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">Business Phone *</label>
                <input
                  name="businessPhone"
                  value={signupData.businessPhone || ""}
                  onChange={handleChange}
                  placeholder="+2519..."
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">Business Address *</label>
                <input
                  name="businessAddress"
                  value={signupData.businessAddress || ""}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">City *</label>
                <input
                  name="city"
                  value={signupData.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">Region *</label>
                <input
                  name="region"
                  value={signupData.region || ""}
                  onChange={handleChange}
                  placeholder="Region"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black">Tax ID *</label>
                <input
                  name="taxId"
                  value={signupData.taxId || ""}
                  onChange={handleChange}
                  placeholder="Tax ID"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-black">Description *</label>
                <textarea
                  name="businessDescription"
                  value={signupData.businessDescription || ""}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:col-span-2">
                <div>
                  <label className="block font-medium text-black">Logo Image URL</label>
                  <input
                    name="imageUrl"
                    type="url"
                    value={signupData.imageUrl || ""}
                    onChange={handleChange}
                    placeholder="Logo Image URL"
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-black">License image *</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={signupData.licenseName || ""}
                      placeholder="Upload a license file..."
                      className="w-full border p-2 rounded cursor-pointer pr-10"
                      onClick={() => fileInputRef.current.click()}
                      required={!signupData.licenseName}
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                    <input
                      type="file"
                      name="license"
                      ref={fileInputRef}
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4 gap-2">
              <button disabled className="bg-gray-300 text-white px-4 py-2 rounded">Previous</button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium text-black">Password *</label>
              <input
                name="password"
                type="password"
                value={signupData.password || ""}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full border p-2 rounded"
                required
              />
              {signupData.password && signupData.password.length < 8 && (
                <p className="text-red-600 text-sm">Password must be at least 8 characters</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-black">Confirm Password *</label>
              <input
                name="confirmPassword"
                type="password"
                value={signupData.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full border p-2 rounded"
                required
              />
              {signupData.confirmPassword &&
                signupData.password !== signupData.confirmPassword && (
                  <p className="text-red-600 text-sm">Passwords do not match</p>
                )}
            </div>

            <div className="flex justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`text-white px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-accent hover:bg-secondary"}`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>

      <Toaster />
    </div>
  );
}