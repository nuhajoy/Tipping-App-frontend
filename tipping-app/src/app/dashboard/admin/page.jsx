"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { useAdminStore } from "@/store/adminStore";

export default function AdminDashboard() {
  const {
    providers,
    expandedRow,
    editRow,
    searchQuery,
    activeTab,
    setExpandedRow,
    setEditRow,
    setSearchQuery,
    setActiveTab,
    loadProviders,
    handleApprove,
    handleSuspend,
    handleRemove,
  } = useAdminStore();

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const filteredProviders = providers.filter((p) =>
    p.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const Header = () => (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-primary shadow-md">
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span className="text-xl font-bold text-secondary">TipTop</span>
      </div>
      <nav className="flex flex-wrap gap-4 text-sm font-medium text-secondary">
        <button
          onClick={() => setActiveTab("providers")}
          className={`px-3 py-1 rounded ${
            activeTab === "providers"
              ? "text-secondary underline"
              : "hover:bg-muted text-secondary"
          }`}
        >
          Providers
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-3 py-1 rounded ${
            activeTab === "transactions"
              ? "underline text-secondary"
              : "hover:bg-muted text-secondary"
          }`}
        >
          Transactions
        </button>
        <a
          href="/"
          className="px-3 py-1 rounded hover:bg-muted text-secondary"
        >
          Logout
        </a>
      </nav>
    </header>
  );
 

 // I hardcoded transaction data for demonstration purposes and the ui will be updated too
  const transactions = [
    { title: "Top Performer", amount: "1200 ETB" },
    { title: "Most Active Provider", amount: "950 ETB" },
    { title: "Highest Single Tip", amount: "500 ETB" },
  ];

  return (
    <div className="min-h-screen bg-primary text-secondary">
      <Header />

      <div className="p-4 md:p-6 space-y-6">
        {activeTab === "providers" && (
          <Card className="p-4 rounded-2xl shadow-lg border border-secondary">
            <h3 className="text-lg font-semibold mb-4">Service Providers</h3>

            <Input
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 !shadow-none max-w-sm"
            />

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-muted/70">
                        No service providers found
                      </td>
                    </tr>
                  ) : (
                    filteredProviders.flatMap((provider) => [
                      <tr
                        key={provider.id}
                        className="border-b border-secondary hover:bg-muted/50 cursor-pointer"
                        onClick={() => setExpandedRow(provider.id)}
                      >
                        <td className="p-2 border">{provider.businessName}</td>
                        <td className="p-2 border">{provider.businessType}</td>
                        <td className="p-2 border">{provider.businessEmail}</td>
                        <td className="p-2 border">{provider.status || "Pending"}</td>
                        <td className="p-2 border space-x-2">
                          {editRow === provider.id ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-muted hover:opacity-90 text-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApprove(provider.id);
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="bg-muted hover:opacity-90 text-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSuspend(provider.id);
                                }}
                              >
                                Suspend
                              </Button>
                              <Button
                                size="sm"
                                className="bg-error hover:opacity-90 text-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(provider.id);
                                }}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditRow(provider.id);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>,

                      expandedRow === provider.id && (
                        <tr
                          key={provider.id + "-details"}
                          className="bg-muted/30"
                        >
                          <td colSpan="5" className="p-4 text-sm">
                            <div className="space-y-1">
                              <p>
                                <strong>Description:</strong>{" "}
                                {provider.businessDescription || "—"}
                              </p>
                              <p>
                                <strong>Address:</strong> {provider.businessAddress}
                              </p>
                              <p>
                                <strong>City:</strong> {provider.city}
                              </p>
                              <p>
                                <strong>Region:</strong> {provider.region}
                              </p>
                              <p>
                                <strong>Phone:</strong> {provider.businessPhone}
                              </p>
                              <p>
                                <strong>Tax ID:</strong> {provider.taxId || "—"}
                              </p>
                             
                            </div>
                          </td>
                        </tr>
                      ),
                    ])
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "transactions" && (
          <Card className="p-4 rounded-2xl shadow-lg border border-secondary">
            <h3 className="text-lg font-semibold mb-4">Transaction Overview</h3>
            <ul className="space-y-3">
              {transactions.map((t, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-muted rounded-lg flex justify-between"
                >
                  <span>{t.title}</span>
                  <span className="font-bold">{t.amount}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
