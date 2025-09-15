"use client";

import { useAdminStore } from "@/store/adminStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const useProviderListState = () => {
  const {
    providers,
    expandedRow,
    editRow,
    searchQuery,
    loading,
    error,
    setSearchQuery,
    setExpandedRow,
    setEditRow,
    handleApprove,
    handleSuspend,
    handleRemove,
    loadProviders,
    setLoading,
    setError,
  } = useAdminStore();

  if (!providers.length && !loading && !error) {
    setLoading(true);
    try {
      loadProviders();
    } catch (err) {
      console.error("Failed to load providers data:", err);
      setError("Couldn't retrieve provider list. Please check the network.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProviders = !searchQuery
    ? providers
    : providers.filter((p) =>
        (p.businessName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

  return {
    filteredProviders,
    searchQuery,
    setSearchQuery,
    expandedRow,
    setExpandedRow,
    editRow,
    setEditRow,
    loading,
    error,
    handleApprove,
    handleSuspend,
    handleRemove,
  };
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
}) => {
  const getStatusClass = (status) => {
    if (status === "Approved" || status === "Verified") return "text-green-500 bg-green-100";
    if (status === "Suspended") return "text-red-500 bg-red-100";
    return "text-yellow-500 bg-yellow-100";
  };

  const handleEditClick = (e, providerId) => {
    e.stopPropagation();
    setEditRow(editRow === providerId ? null : providerId);
    setExpandedRow(expandedRow === providerId ? null : providerId);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {providers.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-center text-muted-foreground">
                No service providers found. Try a different search?
              </td>
            </tr>
          ) : (
            providers.flatMap((provider) => {
              const providerKey = provider.id || provider.businessEmail;
              const displayStatus = provider.status || "Pending";

              const row = (
                <tr
                  key={providerKey}
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => setExpandedRow(expandedRow === providerKey ? null : providerKey)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{provider.businessName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{provider.businessType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{provider.businessEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(displayStatus)}`}>
                      {displayStatus === "Verified" ? "Approved" : displayStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button size="sm" variant="outline" onClick={(e) => handleEditClick(e, providerKey)}>
                      {editRow === providerKey ? "Close" : "Edit"}
                    </Button>
                  </td>
                </tr>
              );

              const details = (
                <tr key={`${providerKey}-details`} className="bg-muted">
                  <td colSpan="5" className="p-4 text-sm text-muted-foreground">
                    <div className="grid grid-cols-2 gap-2">
                      <p><strong>Description:</strong> {provider.businessDescription || "N/A"}</p>
                      <p><strong>Address:</strong> {provider.businessAddress || "N/A"}</p>
                      <p><strong>City:</strong> {provider.city || "N/A"}</p>
                      <p><strong>Region:</strong> {provider.region || "N/A"}</p>
                      <p><strong>Phone:</strong> {provider.businessPhone || "N/A"}</p>
                      <p><strong>Tax ID:</strong> {provider.taxId || "N/A"}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={() => handleApprove(provider.id)}>Approve</Button>
                      <Button variant="destructive" onClick={() => handleSuspend(provider.id)}>Suspend</Button>
                      <Button variant="outline" className="text-red-500" onClick={() => handleRemove(provider.id)}>Remove</Button>
                    </div>
                  </td>
                </tr>
              );

              return expandedRow === providerKey ? [row, details] : [row];
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
    expandedRow,
    setExpandedRow,
    editRow,
    setEditRow,
    loading,
    error,
    handleApprove,
    handleSuspend,
    handleRemove,
  } = useProviderListState();


  const approvedCount = filteredProviders.filter(p => p.status === "Approved" || p.status === "Verified").length;
  const suspendedCount = filteredProviders.filter(p => p.status === "Suspended").length;
  const pendingCount = filteredProviders.length - approvedCount - suspendedCount;

  const summaryStats = [
    { title: "Total Providers", value: filteredProviders.length },
    { title: "Approved", value: approvedCount },
    { title: "Suspended", value: suspendedCount },
    { title: "Pending", value: pendingCount },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-muted-foreground">{stat.title}</h4>
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
          <p className="text-muted-foreground">Loading providers...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
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
    </div>
  );
}
