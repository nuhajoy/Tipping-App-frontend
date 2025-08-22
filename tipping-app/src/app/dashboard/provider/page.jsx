"use client";

import { useState, useEffect } from "react";

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
          {
            id: "1",
            name: "Alice Johnson",
            role: "Barista",
            status: "Active",
            tip: 15,
            code: "TIP-ABCDE",
          },
          {
            id: "2",
            name: "Bob Smith",
            role: "Delivery",
            status: "Inactive",
            tip: 0,
            code: "TIP-FGHIJ",
          },
          {
            id: "3",
            name: "Charlie Davis",
            role: "Cashier",
            status: "Active",
            tip: 25,
            code: "TIP-KLMNO",
          },
          {
            id: "4",
            name: "Diana Evans",
            role: "Manager",
            status: "Active",
            tip: 50,
            code: "TIP-PQRST",
          },
          {
            id: "5",
            name: "Ethan Foster",
            role: "Barista",
            status: "Active",
            tip: 10,
            code: "TIP-UVWXY",
          },
          {
            id: "6",
            name: "Fiona Green",
            role: "Delivery",
            status: "Inactive",
            tip: 0,
            code: "TIP-ZABCD",
          },
          {
            id: "7",
            name: "George Harris",
            role: "Cashier",
            status: "Active",
            tip: 30,
            code: "TIP-EFGHI",
          },
          {
            id: "8",
            name: "Hannah White",
            role: "Manager",
            status: "Active",
            tip: 65,
            code: "TIP-JKLMNOP",
          },
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
        tip: 0,
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

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="mx-auto overflow-hidden">
        <header className="px-3 sm:px-6 py-3 border-b border-gray-200">
          <h2 className="font-bold text-2xl text-gray-800">TipTop</h2>
          <p className="text-gray-400 text-sm mt-1">EthioCoffee House</p>
        </header>

        <main className="p-4 sm:p-6">
          {message && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center text-white bg-green-500 transition-opacity duration-300">
              {message}
            </div>
          )}

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-semibold text-lg sm:text-xl text-gray-700">
              Employee Management
            </h3>
            <button
              onClick={handleAddEmployeeClick}
              className="w-full sm:w-auto bg-gray-800 border border-gray-400 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Add Employee
            </button>
          </div>

          {isAddingEmployee && (
            <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <h4 className="font-semibold text-base sm:text-lg text-gray-700 mb-4">
                Add New Employee
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Role:
                  </label>
                  <input
                    type="text"
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Status:
                  </label>
                  <select
                    className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="bg-[#71FF71] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAddEmployee}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Tip ($)
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="bg-white hover:bg-gray-50 border-b border-gray-100"
                  >
                    {editingEmployee && editingEmployee.id === employee.id ? (
                      <>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="name"
                            value={editingEmployee.name}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="role"
                            value={editingEmployee.role}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <select
                            name="status"
                            value={editingEmployee.status}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          {editingEmployee.tip}
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <input
                            type="text"
                            name="code"
                            value={editingEmployee.code}
                            onChange={handleEditInputChange}
                            className="w-full border rounded-lg py-1 px-2"
                          />
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-[#71FF71] hover:text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 sm:px-6 py-4">{employee.name}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.role}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.status}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.tip}</td>
                        <td className="px-3 sm:px-6 py-4">{employee.code}</td>
                        <td className="px-3 sm:px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(employee)}
                            className="text-green-600 hover:text-[#71FF71]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-3 sm:px-6 py-6 text-center text-gray-500"
                    >
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