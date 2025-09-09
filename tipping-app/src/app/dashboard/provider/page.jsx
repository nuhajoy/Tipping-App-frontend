"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Settings,
  Search,
  PlusCircle,
  LogOut,
  Menu,
  X as CloseIcon,
  Coffee,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  fetchEmployees,
  registerEmployee,
  toggleEmployeeStatusAPI,
} from "@/api";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmployeeCount, setNewEmployeeCount] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = "2|BHt5RGh1PkdkSoXucfyANGfbQCLJ2p5i4rtWmKBmd50fa7cf";

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Load employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(token);
        console.log("Employees API response:", data);

        // handle case when API returns { employees: [...] }
        const list = data.employees || data;

        setEmployees(
          list.map((emp) => ({
            code: emp.tip_code,
            id: emp.id, // <-- Add this line
            isActive: emp.is_active ?? true,
          }))
        );
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    loadEmployees();
  }, [token]);

  const addEmployee = async () => {
    if (!newEmployeeCount || newEmployeeCount < 1) {
      showMessage("Enter a valid number of employees", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await registerEmployee(
        { count: newEmployeeCount },
        token
      );
      console.log(response.employees);

      const createdEmployees = (response.employees || []).map((emp) => ({
        id: emp.id,
        code: emp.employee_code, // 👈 use employee_code here
        isActive: true,
      }));

      // Append new employees to existing list
      setEmployees((prev) => [...prev, ...createdEmployees]);

      setNewEmployeeCount(1);
      setShowForm(false);
      showMessage(`${createdEmployees.length} employee(s) added successfully!`);
    } catch (err) {
      console.error(err);
      showMessage("Error adding employee: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      setLoading(true);
      const emp = employees.find((e) => e.id === id);
      if (!emp) {
        // Log an error if the employee isn't found
        console.error("Employee not found in local state:", id);
        return;
      }

      // Call the API with the correct ID and the opposite status
      await toggleEmployeeStatusAPI(emp.id, !emp.isActive, token);

      // Update the local state
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
      );
      showMessage(`Employee is now ${!emp.isActive ? "Active" : "Inactive"}`);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const chartData = [
  { name: "Active", value: employees.filter(e => e.isActive).length },
  { name: "Inactive", value: employees.filter(e => !e.isActive).length },
];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      <motion.div
        initial={{ x: isMobile ? -256 : 0 }}
        animate={{ x: isMobileMenuOpen || !isMobile ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed md:relative inset-y-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-6 px-4 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <Image
              src="/logo.png"
              alt="TipTop Logo"
              width={100}
              height={60}
              priority
            />
          </div>
          <nav className="space-y-1">
            {[
              { key: "overview", label: "Dashboard", icon: BarChart3 },
              { key: "employees", label: "Employees", icon: Users },
              { key: "settings", label: "Settings", icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === key
                    ? "bg-[var(--accent)] hover:opacity-90"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleTabChange(key)}
              >
                <Icon className="mr-3 h-5 w-5" /> {label}
              </Button>
            ))}
          </nav>
        </div>

        {isMobile && (
          <Button
            variant="destructive"
            className="flex items-center justify-center h-10 bg-red-600 mt-4"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        )}
      </motion.div>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isMobile ? "overflow-auto" : "overflow-hidden"
        } md:overflow-auto`}
      >
        <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/default.jpg" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  Cafe Admin
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  EthioCoffee
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-none rounded"
              />
            </div>
            {!isMobile && (
              <Button
                variant="destructive"
                className="flex items-center justify-center h-10 bg-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </Button>
            )}
          </div>
        </header>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white ${
                message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-50">
            <div className="flex space-x-6">
              {[Users, BarChart3, Coffee].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: ["0%", "-20%", "0%"] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                    delay: idx * 0.2,
                  }}
                  className="text-white"
                >
                  <Icon className="h-12 w-12" />
                </motion.div>
              ))}
            </div>
            <p className="text-white mt-4 text-lg animate-pulse">
              Loading your dashboard...
            </p>
          </div>
        )}

        <main className="p-4 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Overview */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back, Cafe Admin!
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                  {[
                    "Total Employees",
                    "Active Employees",
                    "Inactive Employees",
                  ].map((title, idx) => (
                    <Card
                      key={idx}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-sm md:text-base">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                   <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
  {title === "Total Employees" ? employees.length : title === "Active Employees" ? employees.filter(e => e.isActive).length : employees.filter(e => !e.isActive).length}
</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pie Chart */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm md:text-base">
                      Employee Status Ratio
                    </CardTitle>
                    <CardDescription>
                      Active vs Inactive Employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employees */}
            <TabsContent value="employees">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="text-sm md:text-base text-gray-800">
                      Employees
                    </CardTitle>
                    <CardDescription>Manage your cafe staff</CardDescription>
                  </div>
                  {!showForm ? (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="flex items-center bg-[var(--accent)]"
                      disabled={loading}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  )}
                </CardHeader>

                {showForm && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                      <input
                        type="number"
                        min={1}
                        value={newEmployeeCount}
                        onChange={(e) =>
                          setNewEmployeeCount(parseInt(e.target.value))
                        }
                        placeholder="Number of employees to add"
                        className="w-full px-3 py-2 border rounded"
                        disabled={loading}
                      />
                    </div>
                    <Button
                      onClick={addEmployee}
                      className="bg-[var(--accent)] hover:opacity-90"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Generate Code(s)"}
                    </Button>
                  </div>
                )}

                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        {["Code", "Status", "Actions"].map((head, idx) => (
                          <th
                            key={idx}
                            className={`px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300 ${
                              head === "Actions" ? "text-right" : ""
                            }`}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td className="px-4 py-2">{emp.code}</td>
                          <td className="px-4 py-2">
                            <Badge
                              variant={emp.isActive ? "success" : "destructive"}
                            >
                              {emp.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-right">
                          <Button size="sm" variant="ghost" onClick={() => toggleActive(emp.id)} disabled={loading}>
    <Badge variant={emp.isActive ? "destructive" : "success"}>
        {emp.isActive ? "Deactivate" : "Activate"}
    </Badge>
</Button>
                          </td>
                        </tr>
                      ))}
                      {employees.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 text-center text-gray-500 dark:text-gray-400"
                          >
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-6">
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure your cafe dashboard preferences.
                </CardDescription>
                <Button
                  onClick={handleLogout}
                  className="mt-4 bg-red-600 hover:opacity-90"
                >
                  Logout
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
