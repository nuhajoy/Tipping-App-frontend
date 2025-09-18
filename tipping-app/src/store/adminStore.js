import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAdminStore = create((set) => ({
  providers: [],
  categories: [],
  expandedRow: null,
  editRow: null,
  searchQuery: "",
  activeTab: "providers",
  loading: false,
  error: null,

  setProviders: (newProviders) => {
    set({ providers: newProviders });
    localStorage.setItem("serviceProviders", JSON.stringify(newProviders));
  },
  setCategories: (newCategories) => {
    set({ categories: newCategories });
    localStorage.setItem("categories", JSON.stringify(newCategories));
  },

  setExpandedRow: (id) =>
    set((state) => ({ expandedRow: state.expandedRow === id ? null : id })),
  setEditRow: (id) =>
    set((state) => ({ editRow: state.editRow === id ? null : id })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  loadProviders: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(`${API_URL}/admin/service-providers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const providersArray = Array.isArray(res.data?.data) ? res.data.data : [];

      const mappedProviders = providersArray.map((p) => ({
        id: p.id,
        businessName: p.name,
        businessType: p.category_id,
        businessEmail: p.email,
        businessDescription: p.description,
        businessPhone: p.contact_phone,
        businessAddress: p.address || "N/A",
        city: p.city || "N/A",
        region: p.region || "N/A",
        taxId: p.tax_id,
        status:
          p.is_verified === 1
            ? "Verified"
            : p.is_suspended === 1
            ? "Suspended"
            : "Pending",
        imageUrl: p.image_url || "",
        license: p.license || "",
        createdAt: p.created_at || null,
        updatedAt: p.updated_at || null,
      }));

      set({ providers: mappedProviders });
      localStorage.setItem("serviceProviders", JSON.stringify(mappedProviders));
    } catch (err) {
      console.error("Error fetching providers:", err);
      set({ error: "Failed to fetch providers. Please try again." });
    } finally {
      set({ loading: false });
    }
  },

  loadCategories: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(`${API_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoriesArray = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const mappedCategories = categoriesArray.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "N/A",
        createdAt: c.created_at || null,
        updatedAt: c.updated_at || null,
      }));

      set({ categories: mappedCategories });
      localStorage.setItem("categories", JSON.stringify(mappedCategories));
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({ error: "Failed to fetch categories. Please try again." });
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
