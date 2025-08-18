import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">TipTop - Dashboard</h1>
          <h2 className="text-sm text-gray-500 text-center mt-1">Coffee House</h2>
        </div>

        <div className="flex gap-2">
          <Button className="border-2 border-[#80461B] text-[#80461B] bg-white rounded-2xl hover:bg-[#80461B]/10">
            Add Employee
          </Button>

          <Button className="bg-transparent text-black hover:bg-black/5">
            Login
          </Button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle>Total Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[#80461B]">15420.50 ETB</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[#80461B]">3240.75 ETB</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[#80461B]">890.25 ETB</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-[#80461B]">12</p>
          </CardContent>
        </Card>
      </section>

      {/* Tabs */}
      <div className="px-6 flex justify-center">
        <div className="flex gap-4 border-b pb-2 mb-4">
          <button className="font-medium border-b-2 border-[#80461B] bg-[#80461B]/10 px-4 py-2 rounded">
            Overview
          </button>
          <button className="text-gray-500 px-4 py-2">Employee</button>
        </div>
      </div>

      {/* Content Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
        {/* Recent Tips */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Recent Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between border-b pb-2">
                <span>Example 1</span>
                <span className="font-semibold text-[#80461B]">220.00 ETB</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Example 2</span>
                <span className="font-semibold text-[#80461B]">93.75 ETB</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Example 3</span>
                <span className="font-semibold text-[#80461B]">55.75 ETB</span>
              </li>
              <li className="flex justify-between">
                <span>Example 4</span>
                <span className="font-semibold text-[#80461B]">60.75 ETB</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between border-b pb-2">
                <span>Example 1 (Manager)</span>
                <span className="font-semibold text-[#80461B]">3320.00 ETB</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Example 2</span>
                <span className="font-semibold text-[#80461B]">2340.50 ETB</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Example 3</span>
                <span className="font-semibold text-[#80461B]">2100.75 ETB</span>
              </li>
              <li className="flex justify-between">
                <span>Example 4 (Barista)</span>
                <span className="font-semibold text-[#80461B]">1800.25 ETB</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-10 bg-gray-900 text-gray-300 px-6 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h2 className="font-semibold text-white">TipTop</h2>
            <p className="text-sm">Revolutionizing the tipping experience for service industries across Ethiopia.</p>
          </div>
          <div>
            <h2 className="font-semibold text-white">Product</h2>
            <ul className="text-sm space-y-1">
              <li>How it works</li>
              <li>Register your business</li>
              <li>Send us a tip</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-white">Support</h2>
            <ul className="text-sm space-y-1">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-6">© 2025 TipTop. All rights reserved.</div>
      </footer>
    </div>
  );
}
