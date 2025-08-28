"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSignOutAlt } from "react-icons/fa"; // ✅ Added logout icon

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("");
  const [newEmployeeStatus, setNewEmployeeStatus] = useState("Active");
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmployees = localStorage.getItem("employees");
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        const dummyEmployees = [
          { id: "1", name: "Alice Johnson", role: "Barista", status: "Active", code: "TIP-ABCDE" },
          { id: "2", name: "Bob Smith", role: "Delivery", status: "Inactive", code: "TIP-FGHIJ" },
          { id: "3", name: "Charlie Davis", role: "Cashier", status: "Active", code: "TIP-KLMNO" },
          { id: "4", name: "Diana Evans", role: "Manager", status: "Active", code: "TIP-PQRST" },
        ];
        setEmployees(dummyEmployees);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees]);

  const handleAddEmployeeClick = () => {
    setIsAddingEmployee(true);
    setNewEmployeeStatus("Active");
  };

  const generateUniqueId = () => Math.random().toString(36).substr(2, 9);
  const generateEmployeeCode = () =>
    `TIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const handleSaveEmployee = () => {
    if (newEmployeeName.trim() && newEmployeeRole.trim()) {
      const newEmployee = {
        id: generateUniqueId(),
        name: newEmployeeName,
        role: newEmployeeRole,
        status: newEmployeeStatus,
        code: generateEmployeeCode(),
      };
      setEmployees((prev) => [...prev, newEmployee]);
      setIsAddingEmployee(false);
      setNewEmployeeName("");
      setNewEmployeeRole("");
      setNewEmployeeStatus("Active");
      showMessage("Employee added successfully!");
    } else {
      showMessage("Please enter both name and role.");
    }
  };

  const handleCancelAddEmployee = () => {
    setIsAddingEmployee(false);
    setNewEmployeeName("");
    setNewEmployeeRole("");
    setNewEmployeeStatus("Active");
  };

  const handleEditClick = (employee) => setEditingEmployee({ ...employee });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp))
    );
    setEditingEmployee(null);
    showMessage("Employee updated successfully!");
  };

  const handleCancelEdit = () => setEditingEmployee(null);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    showMessage("Employee deleted successfully!");
  };

  const handleLogout = () => {
    localStorage.clear();
    showMessage("You have logged out.");
    setTimeout(() => {
      window.location.href = "/login"; 
    }, 1500);
  };

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <div className="mx-auto overflow-hidden">
        <header className="flex justify-between items-center px-3 sm:px-6 py-3 border-b border-border">
          <div>
            <h2 className="font-bold text-2xl">TipTop</h2>
            <p className="text-muted-foreground text-sm">EthioCoffee House</p>
          </div>
          <div className="flex items-center gap-4">
          
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-accent text-accent-foreground font-bold py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
        {message && (
  <div className="mb-4">
    <span className="inline-block mx-auto px-4 py-2 rounded-lg text-sm text-foreground bg-accent shadow-sm">
      {message}
    </span>
  </div>
)}


          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-semibold text-lg sm:text-xl">Employee Management</h3>
            <button
              onClick={handleAddEmployeeClick}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Add Employee
            </button>
          </div>

          {isAddingEmployee && (
            <div className="mb-6 p-4 sm:p-6 bg-muted rounded-lg border border-border shadow-inner">
              <h4 className="font-semibold text-base sm:text-lg mb-4">Add New Employee</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Name:</label>
                  <input
                    type="text"
                    className="shadow-sm border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Role:</label>
                  <input
                    type="text"
                    className="shadow-sm border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Status:</label>
                  <select
                    className="shadow-sm border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    value={newEmployeeStatus}
                    onChange={(e) => setNewEmployeeStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={handleSaveEmployee}
                  className="bg-accent text-accent-foreground font-bold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAddEmployee}
                  className="bg-muted text-muted-foreground font-bold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="shadow-lg rounded-lg border border-border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Role</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Code</th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="bg-background hover:bg-muted border-b border-border">
                    {editingEmployee && editingEmployee.id === employee.id ? (
                      <>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="name"
                            value={editingEmployee.name}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2 bg-background text-foreground"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="role"
                            value={editingEmployee.role}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2 bg-background text-foreground"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <select
                            name="status"
                            value={editingEmployee.status}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2 bg-background text-foreground"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="code"
                            value={editingEmployee.code}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2 bg-background text-foreground"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right space-x-2">
                          <button onClick={handleSaveEdit} className="text-accent hover:underline">
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="text-muted-foreground hover:underline">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 sm:px-6 py-4">{employee.name}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.role}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.status}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.code}</td>
                        <td className="px-3 sm:px-6 py-4 text-right space-x-3">
                          <button
                            onClick={() => handleEditClick(employee)}
                            className="text-accent hover:text-accent/80"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 sm:px-6 py-6 text-center text-muted-foreground">
                      No employees added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
