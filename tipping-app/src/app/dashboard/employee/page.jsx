"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";

export default function EmployeeDashboard() {
    const [visibleTips, setVisibleTips] = useState(10);
    const [uploadedImage, setUploadedImage] = useState(null);
    const router = useRouter();
    const mockData = {
        employee: {
            first_name: "Melat",
            last_name: "Tesfaye",
            role: "Barista",
            unique_id: "EMP123",
            is_active: true,
            service_provider: {
                name: "TipTop Café",
                category: "Hospitality"
            },
            sub_account_id: "CHAPA123",
            profile_pic: "/images/melat.jpg"
        },
        stats: {
            total_tips: 4200,
            monthly_tips: 1200,
            weekly_tips: 300,
            average_rating: 4.7,
            rating_count: 85
        },
        tips: Array.from({ length: 25 }, (_, i) => ({
            amount: Math.floor(Math.random() * 100) + 10,
            date: `2025-08-${(i % 30) + 1}`,
            time: "14:30",
            sender: i % 3 === 0 ? "Anonymous" : `User${i}`,
            rating: Math.floor(Math.random() * 5) + 1
        })),
        payouts: [
            {
                amount: 1000,
                date: "2025-08-10",
                status: "Completed",
                chapa_id: "TXP123456"
            }
        ],
        weeklyPerformance: [
            { day: "Mon", amount: "45.50 ETB" },
            { day: "Tue", amount: "67.25 ETB" }
        ]
    };
    const toggleTips = () => {
        setVisibleTips(prev => (prev === 10 ? mockData.tips.length : 10));
    };

    const handleLogout = () => {
    // Clear auth token or session
    localStorage.removeItem("authToken"); // or use cookies/session logic

    // Redirect to home, then to signup
    router.push("/");

};
    return (
      <div className=" min-h-screen bg-[#F9F9F9] text-[#1A1A1A] flex flex-col">
        {/* Header with Avatar Upload */}
        <header className="fixed top-0 left-0 right-0  flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setUploadedImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <label htmlFor="avatarUpload" className="cursor-pointer">
              <Avatar className="w-12 h-12 border-2 border-[#00C853]">
                <AvatarImage
                  src={uploadedImage || mockData.employee.profile_pic}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#E0E0E0] text-[#666] font-medium">
                  {mockData.employee.first_name[0]}
                  {mockData.employee.last_name[0]}
                </AvatarFallback>
              </Avatar>
            </label>
            <div>
              <h1 className="text-lg font-bold text-[#1A1A1A]">
                {mockData.employee.first_name} {mockData.employee.last_name}
              </h1>
              <p className="text-xs text-[#666]">
                {mockData.employee.role} @{" "}
                {mockData.employee.service_provider.name}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-sm font-medium border border-[#00C853] text-[#00C853] hover:bg-[#E8F5E9]"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>
        {/* Main Content */}
        <main className="flex-1 px-6 py-8 space-y-8 mt-20">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Tips",
                value: `${mockData.stats.total_tips} ETB`,
                icon: "💰",
              },
              {
                label: "This Month",
                value: `${mockData.stats.monthly_tips} ETB`,
                icon: "📅",
              },
              {
                label: "This Week",
                value: `${mockData.stats.weekly_tips} ETB`,
                icon: "📈",
              },
              {
                label: "Average Rating",
                value: `${mockData.stats.average_rating}`,
                extra: `${mockData.stats.rating_count} ratings`,
                icon: "⭐",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="bg-gradient-to-br from-white to-[#F1F8E9] shadow-md rounded-xl p-4"
              >
                <CardHeader className="flex items-center justify-between text-sm text-[#666]">
                  <span>{stat.label}</span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-[#00C853]/10 text-[#00C853] text-xl font-bold">
                    {stat.icon}
                  </span>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-[#1A1A1A]">
                  {stat.value}
                </CardContent>
                {stat.extra && (
                  <p className="text-xs text-[#999] mt-1">{stat.extra}</p>
                )}
              </Card>
            ))}
          </div>
          {/* Service Provider Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Business",
                value: mockData.employee.service_provider.name,
                icon: "🏢",
              },
              {
                label: "Category",
                value: mockData.employee.service_provider.category,
                icon: "🧾",
              },
              { label: "Role", value: mockData.employee.role, icon: "🧑‍🍳" },
              {
                label: "Sub-Account ID",
                value: mockData.employee.sub_account_id,
                icon: "🔐",
              },
            ].map((info, i) => (
              <Card key={i} className="bg-white shadow-sm rounded-lg p-4">
                <CardHeader className="flex items-center justify-between text-sm text-[#666">
                  <span>{info.label}</span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-[#FF6B00]/10 text-[#FF6B00] text-xl font-bold">
                    {info.icon}
                  </span>
                </CardHeader>
                <CardContent className="text-base font-semibold text-[#1A1A1A]">
                  {info.value}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bank Details Form */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Bank Details
            </h3>
            <Card className="bg-white shadow-sm rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Commercial Bank of Ethiopia"
                    className="w-full px-4 py-2 border border-[#DDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Melat Tesfaye"
                    className="w-full px-4 py-2 border border-[#DDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1000123456789"
                    className="w-full px-4 py-2 border border-[#DDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shewa Robit Branch"
                    className="w-full px-4 py-2 border border-[#DDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C853]"
                  />
                </div>
              </div>
              <Button
                variant="default"
                className="bg-[#00C853] text-white hover:bg-[#009624] font-medium"
              >
                Save Bank Details
              </Button>
            </Card>
          </section>

          {/* Latest Tips */}
          <section>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Latest Tips
            </h3>
            <div className="space-y-3">
              {mockData.tips.slice(0, visibleTips).map((tip, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A]">
                      {tip.amount} ETB
                    </p>
                    <p className="text-xs text-[#666]">
                      {tip.date} • {tip.time}
                    </p>
                  </div>
                  <div className="text-sm text-[#666]">
                    {tip.sender} {"⭐".repeat(tip.rating)}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="text-sm mt-5 font-medium border border-[#00C853] text-[#00C853] hover:bg-[#E8F5E9]"
              onClick={toggleTips}
            >
              {visibleTips === 10 ? "See All Tips" : "See Less"}
            </Button>
          </section>
          {/* Weekly Performance */}
          <section>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Weekly Performance
            </h3>
            <div className="space-y-2">
              {mockData.weeklyPerformance.map((day, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm text-[#666]"
                >
                  <span>{day.day}</span>
                  <span>{day.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Payout History */}
          <section>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
              Recent Payouts
            </h3>
            <div className="space-y-3">
              {mockData.payouts.map((payout, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A]">
                      {payout.amount} ETB
                    </p>
                    <p className="text-xs text-[#666]">
                      {payout.date} • {payout.status}
                    </p>
                  </div>
                  <div className="text-sm text-[#999]">
                    Chapa ID: {payout.chapa_id}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        {/* Footer */}
        <Footer />
      </div>
    );
}


