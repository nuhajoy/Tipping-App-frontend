import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div>
  <h1 className="text-lg font-bold">TipTop - Dashboard</h1>
  <h2 className="text-sm text-gray-500 text-center ">Coffee House</h2>
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

    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle>Total Tips</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-bold text-[#80461B]">15420.50 ETB</p>
    </CardContent>
  </Card>

  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle>This Month</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-bold text-[#80461B]">3240.75 ETB</p>
    </CardContent>
  </Card>

  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle>This Week</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-bold text-[#80461B]">890.25 ETB</p>
    </CardContent>
  </Card>

  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle>Active Employees</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-bold text-[#80461B]">12</p>
    </CardContent>
  </Card>
</section>


      <div className="flex justify-center px-6 py-3">
        <div className="bg-[#80461B]/10 p-2 rounded-xl flex gap-4 w-full justify-center"
             style={{ maxWidth: '1500px' }}>
          <button className="font-medium bg-white text-[#80461B] px-4 py-2 rounded-lg shadow-sm">
            Overview
          </button>
          <button className="text-gray-500 px-4 py-2">Employee</button>
        </div>
      </div>
<section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 justify-center">
  <Card>
    <CardHeader>
      <CardTitle>Recent Tips</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <span>Example 1</span>
            <span className="text-sm text-gray-500">8-18-2025</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">220.00 ETB</span>
            <span className="text-sm text-gray-500">From: Anonymous Tipeer</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <span>Example 2</span>
            <span className="text-sm text-gray-500">8-18-2025</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">93.75 ETB</span>
            <span className="text-sm text-gray-500">From: Anonymous Tipeer</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <span>Example 3</span>
            <span className="text-sm text-gray-500">8-18-2025</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">55.75 ETB</span>
            <span className="text-sm text-gray-500">From: Anonymous Tipeer</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <span>Example 4</span>
            <span className="text-sm text-gray-500">8-18-2025</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">60.75 ETB</span>
            <span className="text-sm text-gray-500">From: Anonymous Tipeer</span>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Top Performers</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#80461B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
              <span>Example 1</span>
            </div>
            <span className="text-sm text-gray-500">Manager</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">3320.00 ETB</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#80461B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
              <span>Example 2</span>
            </div>
            <span className="text-sm text-gray-500">Server</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">2340.50 ETB</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#80461B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
              <span>Example 3</span>
            </div>
            <span className="text-sm text-gray-500">Server</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">2100.75 ETB</span>
          </div>
        </li>
        <li className="flex justify-between rounded-lg bg-[#80461B]/5 p-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="bg-[#80461B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
              <span>Example 4</span>
            </div>
            <span className="text-sm text-gray-500">Barista</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-[#80461B]">1800.25 ETB</span>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</section>

     



<footer className="mt-10 bg-gray-900 text-gray-300 px-18 py-8">
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
 
    <div>
      <h2 className="font-semibold text-white">TipTop</h2>
      <p className="text-sm">
        Revolutionizing the tipping experience for service industries across Ethiopia.
      </p>
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

  <hr className="border-gray-700 my-6 max-w-6xl mx-auto" />

  <div className="text-center
   text-gray-500 text-xs max-w-6xl mx-auto">
    © 2025 TipTop. All rights reserved.
  </div>
</footer>
</div>);}