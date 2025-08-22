import { create } from "zustand";
import { toast } from "sonner"; 

export const useAdminStore = create((set) => ({
  providers: [],
  expandedRow: null,
  editRow: null,
  searchQuery: "",
  activeTab: "providers",

  setProviders: (newProviders) => {
    set({ providers: newProviders });
    localStorage.setItem("serviceProviders", JSON.stringify(newProviders));
  },
  setExpandedRow: (id) => set((state) => ({
    expandedRow: state.expandedRow === id ? null : id
  })),
  setEditRow: (id) => set((state) => ({
    editRow: state.editRow === id ? null : id
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  loadProviders: () => {
    const stored = localStorage.getItem("serviceProviders");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        set({ providers: Array.isArray(parsed) ? parsed : [parsed] });
      } catch (err) {
        console.error("Failed to parse service providers", err);
      }
    }
  },
  
  handleApprove: (id) => {
    set((state) => {
      const updated = state.providers.map((p) =>
        p.id === id ? { ...p, status: "Verified" } : p
      );
      toast.success("Provider approved!");
      return { providers: updated };
    });
  },
  handleSuspend: (id) => {
    set((state) => {
      const updated = state.providers.map((p) =>
        p.id === id ? { ...p, status: "Suspended" } : p
      );
      toast("Provider suspended!");
      return { providers: updated };
    });
  },
  handleRemove: (id) => {
    set((state) => {
      const updated = state.providers.filter((p) => p.id !== id);
      toast.error("Provider removed!");
      return { providers: updated };
    });
  },
}));