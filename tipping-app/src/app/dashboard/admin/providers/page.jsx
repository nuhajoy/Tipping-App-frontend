"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getSafeImageUrl = (url) => {
  if (!url) return "/placeholder.png";
  if (url.includes("google.com/imgres")) return "/placeholder.png";
  return url;
};

const useProviderListState = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    if (!token) {
      setError("No auth token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/service-providers?per_page=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data;
        if (typeof data === "string") {
          const jsonStart = data.indexOf("{");
          data = JSON.parse(data.substring(jsonStart));
        }

        const formatted = (data.data || []).map((p) => ({
          ...p,
          status: p.registration_status === "accepted" ? "Verified" : "Pending",
        }));

        setProviders(formatted);
      } catch (err) {
        console.error("Error fetching providers:", err.response || err);
        setError("Failed to fetch providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [token]);

  const handleAction = async (provider, action) => {
    if (!provider.id || !token) return;

    let url = `${API_BASE_URL}/admin/service-providers/${provider.id}`;
    if (action === "approve") url += "/accept";
    if (action === "suspend") url += "/suspend";
    if (action === "unsuspend") url += "/unsuspend";
    if (action === "remove") url += "/reject";

    const payload = action === "suspend" ? { reason: "Policy violation" } : {};

    try {
      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.provider) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === provider.id
              ? {
                  ...p,
                  ...res.data.provider,
                  status:
                    res.data.provider.registration_status === "accepted"
                      ? "Verified"
                      : p.status === "Pending" && action === "approve"
                      ? "Verified"
                      : p.status,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${action} provider:`, err.response || err);
    }
  };

  const filteredProviders = !searchQuery
    ? providers
    : providers.filter((p) =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

  return {
    filteredProviders,
    searchQuery,
    setSearchQuery,
    selectedProvider,
    setSelectedProvider,
    loading,
    error,
    handleAction,
  };
};

const ProvidersTable = ({ providers, setSelectedProvider }) => {
  const getStatusClass = (status) => {
    if (status === "Verified") return "text-[var(--accent-foreground)] bg-[var(--accent)]";
    if (status === "Suspended") return "text-[var(--destructive)] bg-[var(--slight-accent)]";
    return "text-[var(--foreground)] bg-[var(--muted)]";
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y border-[var(--border)]">
        <thead className="bg-[var(--muted)]">
          <tr>
            {["Avatar", "Name", "Email", "Status"].map((title) => (
              <th
                key={title}
                className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--background)] divide-y border-[var(--border)]">
          {providers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-[var(--muted-foreground)]">
                No service providers found.
              </td>
            </tr>
          ) : (
            providers.map((provider) => {
              const displayStatus = provider.status || "Pending";

              return (
                <tr
                  key={provider.id}
                  className="hover:bg-[var(--accent)]/20 cursor-pointer transition-colors"
                  onClick={() => setSelectedProvider(provider)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden">
                      <Image
                        src={getSafeImageUrl(provider.image_url)}
                        alt={provider.name || "Provider"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{provider.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{provider.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(displayStatus)}`}
                    >
                      {displayStatus === "Verified" ? "Approved" : displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function ProvidersSection() {
  const {
    filteredProviders,
    searchQuery,
    setSearchQuery,
    selectedProvider,
    setSelectedProvider,
    loading,
    error,
    handleAction,
  } = useProviderListState();

  const approvedCount = filteredProviders.filter((p) => p.status === "Verified").length;
  const suspendedCount = filteredProviders.filter((p) => p.is_suspended).length;
  const pendingCount = filteredProviders.length - approvedCount - suspendedCount;

  const summaryStats = [
    { title: "Total Providers", value: filteredProviders.length },
    { title: "Approved", value: approvedCount },
    { title: "Suspended", value: suspendedCount },
    { title: "Pending", value: pendingCount },
  ];

  return (
    <div className="space-y-6 bg-background min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-[var(--muted-foreground)]">{stat.title}</h4>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold">Service Providers</h3>
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!shadow-none max-w-xs"
          />
        </div>

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading providers...</p>
        ) : error ? (
          <p className="text-[var(--destructive)]">{error}</p>
        ) : (
          <ProvidersTable
            providers={filteredProviders}
            setSelectedProvider={setSelectedProvider}
          />
        )}
      </Card>

      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedProvider.name}</p>
              <p><strong>Email:</strong> {selectedProvider.email}</p>
              <p><strong>Category:</strong> {selectedProvider.category_id}</p>
              <p><strong>Description:</strong> {selectedProvider.description || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedProvider.contact_phone || "N/A"}</p>
              <p><strong>Tax ID:</strong> {selectedProvider.tax_id || "N/A"}</p>
              {selectedProvider.license && (
                <p>
                  <strong>License:</strong>{" "}
                  <a
                    href={selectedProvider.license}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-foreground)] underline"
                  >
                    View
                  </a>
                </p>
              )}
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => handleAction(selectedProvider, "approve")}
                  className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110 transition-colors"
                >
                  Approve
                </Button>

                {!selectedProvider.is_suspended ? (
                  <Button
                    onClick={() => handleAction(selectedProvider, "suspend")}
                    className="bg-[var(--slight-accent)] text-[var(--foreground)] hover:brightness-110 transition-colors"
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAction(selectedProvider, "unsuspend")}
                    className="bg-[var(--muted)] text-[var(--foreground)] hover:brightness-110 transition-colors"
                  >
                    Unsuspend
                  </Button>
                )}

                <Button
                  onClick={() => handleAction(selectedProvider, "remove")}
                  className="bg-[var(--error)] text-[var(--accent-foreground)] hover:brightness-110 transition-colors"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
