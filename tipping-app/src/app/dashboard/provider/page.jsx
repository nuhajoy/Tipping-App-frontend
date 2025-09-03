"use client";
import { API_URL } from "../../../config";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Settings,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  LogOut,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import {
  fetchEmployees,
  addEmployeeAPI,
  updateEmployeeAPI,
  toggleEmployeeStatusAPI,
  deleteEmployeeAPI,
} from "@/api";

function generateCode(firstName) {
  const prefix = firstName.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomNum}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [editEmployee, setEditEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // State for integrated UI messages
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // { title: '', description: '', onConfirm: () => {} }

  const token = "1|fE68278hOvx0jsxeBmsVXgWqQmTur6BDNzJamKfra9e2c409";

  // Function to show a message banner
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Function to show a confirmation modal
  const showModal = (title, description, onConfirm) => {
    setModalContent({ title, description, onConfirm });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(token);
        // Correctly map the API data to the component's expected format
        const formattedEmployees = (data.employees || []).map((emp) => ({
          id: emp.id,
          firstName: emp.first_name || "", // Use a fallback
          lastName: emp.last_name || "", // Use a fallback
          email: emp.email || "",
          code: emp.code || emp.employee_code,
          // IMPORTANT: Convert the API's 'is_active' to the component's 'active'
          active: !!emp.is_active,
        }));
        setEmployees(formattedEmployees);
      } catch (err) {
        console.error("Failed to load employees:", err);
        setEmployees([]);
        showMessage(
          "Failed to load employees. Please try again later.",
          "error"
        );
      }
    };
    loadEmployees();
  }, [token]);

  const addEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      showMessage("Please fill all fields to add a new employee.", "error");
      return;
    }

    const employeeToSend = {
      ...newEmployee,
      code: generateCode(newEmployee.firstName),
      count: 1,
    };

    try {
      const savedEmployee = await addEmployeeAPI(employeeToSend, token);
      const createdEmployee = savedEmployee.employees?.[0] || {};

      // Correctly add the new employee to the state with the 'active' key
      setEmployees((prev) => [
        ...prev,
        {
          id: createdEmployee.employee_code,
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          code: createdEmployee.employee_code,
          active: true, // New employees are always active
        },
      ]);

      setNewEmployee({ firstName: "", lastName: "", email: "" });
      setShowForm(false);
      showMessage("Employee added successfully!", "success");
    } catch (err) {
      showMessage("Error adding employee: " + err.message, "error");
    }
  };

  const saveEdit = async (id) => {
    try {
      const updated = await updateEmployeeAPI(id, editEmployee, token);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? updated : emp))
      );
      setEditingId(null);
      showMessage("Employee updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update employee:", err);
      showMessage("Failed to update employee. Please try again.", "error");
    }
  };

  const handleDeleteConfirmation = (id) => {
    const onConfirm = async () => {
      try {
        await deleteEmployeeAPI(id, token);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        showMessage("Employee deleted successfully!", "success");
      } catch (err) {
        console.error("Failed to delete employee:", err);
        showMessage("Failed to delete employee. Please try again.", "error");
      } finally {
        closeModal();
      }
    };
    showModal(
      "Are you absolutely sure?",
      "This action cannot be undone. This will permanently delete the employee.",
      onConfirm
    );
  };
  const toggleActive = async (id) => {
    try {
      const emp = employees.find((e) => e.id === id);
      if (!emp) return;

      const url = `${API_URL}/service-providers/employees/${
        emp.active ? "deactivate" : "activate"
      }/${id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorMsg = "Failed to toggle employee status";
        try {
          const errData = await res.json();
          errorMsg = errData.message || errData.error || errorMsg;
        } catch {
          const text = await res.text();
          console.error("Non-JSON response:", text);
        }
        throw new Error(errorMsg);
      }

      // Update frontend state
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
      );

      showMessage(
        `Employee status changed to ${!emp.active ? "Active" : "Inactive"}.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const chartData = [
    { name: "Active", value: employees.filter((e) => e.active).length },
    { name: "Inactive", value: employees.filter((e) => !e.active).length },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar & Mobile Menu */}
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

      <div
        className={`
        ${
          isMobile
            ? "fixed inset-0 z-40 transform transition-transform duration-300"
            : "relative"
        } 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-6 px-4 flex flex-col justify-between
      `}
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
      </div>

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
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
              <Input
                type="text"
                placeholder="Search employees..."
                className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-none"
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

        {/* Integrated Message Banner */}
        {message && (
          <div
            className={`absolute top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <main className="p-4 md:p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Welcome back, Cafe Admin!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Here's a summary of your cafe operations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">
                        Total Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        {employees.length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">
                        Active Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 ">
                        {employees.filter((e) => e.active).length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">
                        Inactive Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 ">
                        {employees.filter((e) => !e.active).length}
                      </p>
                    </CardContent>
                  </Card>
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

            {/* Employees Tab */}
            <TabsContent value="employees">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="text-sm md:text-base text-gray-800 ">
                      Employees
                    </CardTitle>
                    <CardDescription>Manage your cafe staff</CardDescription>
                  </div>

                  {!showForm ? (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="flex items-center bg-[var(--accent)]"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  )}
                </CardHeader>

                {/* Add Employee Form */}
                {showForm && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Input
                        placeholder="First Name"
                        value={newEmployee.firstName}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Last Name"
                        value={newEmployee.lastName}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            lastName: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Email"
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button
                      onClick={addEmployee}
                      className="bg-[var(--accent)] hover:opacity-90"
                    >
                      Save Employee
                    </Button>
                  </div>
                )}

                {/* Employees Table */}
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                          Code
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                          Status
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {employees.map((emp) => (
                        <tr key={emp.id}>
                          <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                            {emp.firstName} {emp.lastName}
                          </td>
                          <td className="px-4 py-2">{emp.email}</td>
                          <td className="px-4 py-2">{emp.code}</td>
                          <td className="px-4 py-2">
                            <Badge
                              variant={emp.active ? "success" : "destructive"}
                            >
                              {emp.active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 flex justify-end space-x-2">
                            {editingId === emp.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit(emp.id)}
                                >
                                  <Check />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  <X />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setEditingId(emp.id);
                                    setEditEmployee({
                                      firstName: emp.firstName,
                                      lastName: emp.lastName,
                                      email: emp.email,
                                    });
                                  }}
                                >
                                  <Edit2 />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteConfirmation(emp.id)
                                  }
                                >
                                  <Trash2 className="text-black" />
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={() => toggleActive(emp.id)}
                                >
                                  {emp.active ? "Deactivate" : "Activate"}
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-6">
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Update your profile and app settings
                </CardDescription>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900 ">
              {modalContent.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {modalContent.description}
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={modalContent.onConfirm}
                className="bg-red-600  hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
