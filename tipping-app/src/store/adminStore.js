import { create } from "zustand";
import { toast } from "sonner"; 

export const useAdminStore = create((set, get) => ({
  providers: [],
  expandedRow: null,
  editRow: null,
  searchQuery: "",
  activeTab: "providers",

  loading: false,
  setLoading: (val) => set({ loading: val }),

  error: "",
  setError: (val) => set({ error: val }),

  hover: null,
  setHover: (val) => set({ hover: val }),

  length: 0,
  setLength: (val) => set({ length: val }),

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

  
  loadProviders: async () => {
    set({ loading: true, error: "" });
    try {
      const stored = localStorage.getItem("serviceProviders");
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ providers: Array.isArray(parsed) ? parsed : [parsed] });
      }
    } catch (err) {
      console.error("Failed to load providers", err);
      set({ error: "Failed to load providers." });
    } finally {
      set({ loading: false });
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
