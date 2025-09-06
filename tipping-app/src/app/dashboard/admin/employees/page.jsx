"use client";

import { create } from "zustand";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MOCK_EMPLOYEES = [
  { id: 1, name: "Abebe", email: "abe@email.com", companyName: "cool cafe", totalEarned: 1200, tipsCount: 15, joinedAt: "2025-01-10" },
  { id: 2, name: "Kebede", email: "Kebede@yahoo.com", companyName: "book shop", totalEarned: 950, tipsCount: 10, joinedAt: "2025-02-05" },
  { id: 3, name: "Abeba", email: "Abeba@example.com", companyName: "book shop", totalEarned: 500, tipsCount: 7, joinedAt: "2025-03-12" },
  { id: 4, name: "Betty", email: "Betty@example.com", companyName: "some business", totalEarned: 800, tipsCount: 12, joinedAt: "2025-04-20" },
  { id: 5, name: "Selam", email: "Selam@example.com", companyName: "cool cafe", totalEarned: 1100, tipsCount: 14, joinedAt: "2025-05-08" },
];

export const useEmployeeStore = create((set, get) => ({
  search: "",
  sortKey: "all",

  setSearch: (val) => set({ search: val }),
  setSortKey: (val) => set({ sortKey: val }),

  getFilteredEmployees: () => {
    const { search, sortKey } = get();

    let list = [...MOCK_EMPLOYEES];

    switch (sortKey) {
      case "mostPaid":
        list.sort((a, b) => b.totalEarned - a.totalEarned);
        break;
      case "frequent":
        list.sort((a, b) => b.tipsCount - a.tipsCount);
        break;
      case "new":
        list.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        break;
      case "company":
        list.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      default:
        break;
    }

    if (!search) return list;

    return list.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );
  },
}));

const EmployeesTable = ({ employees }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[var(--input)] text-[var(--foreground)]">
          <th className="p-3 border text-left">Name</th>
          <th className="p-3 border text-left">Email</th>
          <th className="p-3 border text-left">Company</th>
          <th className="p-3 border text-left">Total Earned</th>
          <th className="p-3 border text-left">Tips Count</th>
          <th className="p-3 border text-left">Joined At</th>
        </tr>
      </thead>
      <tbody>
        {employees.length === 0 ? (
          <tr>
            <td colSpan="6" className="p-4 text-center text-[var(--muted-foreground)]">
              No employees found.
            </td>
          </tr>
        ) : (
          employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
            >
              <td className="p-3 border">{emp.name}</td>
              <td className="p-3 border">{emp.email}</td>
              <td className="p-3 border">{emp.companyName}</td>
              <td className="p-3 border">{emp.totalEarned.toLocaleString()} ETB</td>
              <td className="p-3 border">{emp.tipsCount}</td>
              <td className="p-3 border">{new Date(emp.joinedAt).toLocaleDateString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default function EmployeesSection() {
  const { search, sortKey, setSearch, setSortKey, getFilteredEmployees } = useEmployeeStore();
  const filteredEmployees = getFilteredEmployees();

  const totalEmployees = MOCK_EMPLOYEES.length;
  const topEarnersCount = MOCK_EMPLOYEES.filter((e) => e.totalEarned >= 1000).length;
  const newEmployeesCount = MOCK_EMPLOYEES.filter((e) => new Date(e.joinedAt) > new Date("2025-04-01")).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-[var(--muted-foreground)]">Total Employees</h4>
          <p className="text-2xl font-bold text-[var(--foreground)]">{totalEmployees}</p>
        </Card>

        <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-[var(--muted-foreground)]">Top Earners</h4>
          <p className="text-2xl font-bold text-[var(--secondary)]">{topEarnersCount}</p>
        </Card>

        <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-[var(--muted-foreground)]">New Employees</h4>
          <p className="text-2xl font-bold text-[var(--secondary)]">{newEmployeesCount}</p>
        </Card>
      </div>

      <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 w-full sm:w-auto">
          <Input
            placeholder="Search employees by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!shadow-none max-w-xs"
          />
          <select
            className="border rounded-lg px-3 py-1 bg-[var(--background)] text-[var(--foreground)]"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="all">Sort By: None</option>
            <option value="mostPaid">Most Paid</option>
            <option value="frequent">Most Frequent</option>
            <option value="new">Newest</option>
            <option value="company">Company</option>
          </select>
        </div>

        <EmployeesTable employees={filteredEmployees} />
      </Card>
    </div>
  );
}
