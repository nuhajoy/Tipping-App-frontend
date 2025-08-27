"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "sonner";
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadProviders();
      } catch (err) {
        console.error(err);
        setError("Failed to load providers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loadProviders]);

  const filteredProviders = providers.filter((p) =>
    p.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

const transactions = [
  { title: "Top Performer", amount: "1200 ETB" },
  { title: "Most Active Provider", amount: "950 ETB" },
  { title: "Highest Single Tip", amount: "500 ETB" },
];

  return (
    <div className="min-h-screen bg-primary text-secondary">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-4 md:p-6 space-y-6">
        <DashboardCards />

        {activeTab === "providers" && (
          <Card className="p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Service Providers</h3>

            <Input
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 !shadow-none max-w-sm"
            />

            {loading ? (
              <p className="text-muted">Loading providers...</p>
            ) : error ? (
              <p className="text-error">{error}</p>
            ) : (
              <ProvidersTable
                providers={filteredProviders}
                expandedRow={expandedRow}
                editRow={editRow}
                setExpandedRow={setExpandedRow}
                setEditRow={setEditRow}
                handleApprove={handleApprove}
                handleSuspend={handleSuspend}
                handleRemove={handleRemove}
              />
            )}
          </Card>
        )}

        {activeTab === "transactions" && (
          <Card className="p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Transaction Overview</h3>
            <TransactionsList
              transactions={transactions}
              expandedRow={expandedRow}
              setExpandedRow={setExpandedRow}
              providers={providers}
            />
          </Card>
        )}
      </div>

      <Toaster />
    </div>
  );
}

const Header = ({ activeTab, setActiveTab }) => (
  <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-primary shadow-md">
    <div className="flex items-center gap-2 mb-2 md:mb-0">
      <div
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      ></div>
      <span className="text-xl font-bold text-secondary">
        TipTop - Admin Dashboard
      </span>
    </div>
    <nav className="flex flex-wrap gap-4 text-sm font-medium text-secondary">
      <button
        onClick={() => setActiveTab("providers")}
        className={`px-3 py-1 rounded ${
          activeTab === "providers"
            ? "text-accent underline"
            : "hover:bg-muted text-secondary"
        }`}
      >
        Providers
      </button>
      <button
        onClick={() => setActiveTab("transactions")}
        className={`px-3 py-1 rounded ${
          activeTab === "transactions"
            ? "text-accent underline"
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

const DashboardCards = () => {
  const transactionSummary = {
    recentTransaction: "500 ETB",
    totalTransactions: "16,500 ETB",
    inPlatformMoney: "12,000 ETB",
    withdrawnMoney: "4,500 ETB",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Object.entries(transactionSummary).map(([title, value]) => (
        <Card key={title} className="p-4 rounded-2xl shadow-lg">
          <h4 className="text-sm text-muted mb-2 capitalize">
            {title.replace(/([A-Z])/g, " $1")}
          </h4>
          <p className="text-lg font-bold">{value}</p>
        </Card>
      ))}
    </div>
  );
};

const ProvidersTable = ({
  providers,
  expandedRow,
  editRow,
  setExpandedRow,
  setEditRow,
  handleApprove,
  handleSuspend,
  handleRemove,
}) => (
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
        {providers.length === 0 ? (
          <tr>
            <td colSpan="5" className="p-4 text-center text-muted/70">
              No service providers found
            </td>
          </tr>
        ) : (
          providers.flatMap((provider) => {
            const providerKey =
              provider.id || provider.businessEmail || "unknown-provider";

            const rows = [
              <tr
                key={providerKey}
                className="border-b border-secondary hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  setExpandedRow(expandedRow === providerKey ? null : providerKey)
                }
              >
                <td className="p-2 border">{provider.businessName}</td>
                <td className="p-2 border">{provider.businessType}</td>
                <td className="p-2 border">{provider.businessEmail}</td>
                <td className="p-2 border">{provider.status || "Pending"}</td>
                <td className="p-2 border space-x-2">
                  {editRow === providerKey ? (
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
                        setEditRow(providerKey);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </td>
              </tr>,
            ];

            if (expandedRow === providerKey) {
              rows.push(
                <tr key={providerKey + "-details"} className="bg-muted/30">
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
              );
            }

            return rows;
          })
        )}
      </tbody>
    </table>
  </div>
);

const TransactionsList = ({ transactions, expandedRow, setExpandedRow, providers }) => (
  <ul className="space-y-3">
    {transactions.map((t) => {
      const transactionKey = t.title;
      return (
        <li key={transactionKey} className="bg-muted rounded-lg">
          <div
            className="p-3 flex justify-between cursor-pointer"
            onClick={() =>
              setExpandedRow(expandedRow === transactionKey ? null : transactionKey)
            }
          >
            <span>{t.title}</span>
            <span className="font-bold">{t.amount}</span>
          </div>

          {expandedRow === transactionKey && (
            <div className="p-3 text-sm bg-muted/30 space-y-1">
              <p>
                <strong>Provider Name:</strong>{" "}
                {providers[0]?.businessName || "Sample Hotel"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {providers[0]?.businessEmail || "hotel@example.com"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {providers[0]?.businessPhone || "+251 900 000000"}
              </p>
              <p>
                <strong>City:</strong> {providers[0]?.city || "Addis Ababa"}
              </p>
            </div>
          )}
        </li>
      );
    })}
  </ul>
);


