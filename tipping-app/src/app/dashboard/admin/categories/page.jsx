"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL + "/admin";

const useCategoriesState = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editName, setEditName] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  useEffect(() => {
    if (!token) {
      setError("No auth token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data = res.data;
        if (typeof data === "string") {
          const jsonStart = data.indexOf("[");
          data = JSON.parse(data.substring(jsonStart));
        }

        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err.response || err);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleCreate = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/categories`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) => [...prev, res.data]);
      setNewCategory("");
    } catch (err) {
      console.error("Failed to create category:", err.response || err);
      setError("Failed to create category.");
    }
  };

  const handleUpdate = async (categoryId) => {
    try {
      const res = await axios.put(
        `${API_BASE}/categories/${categoryId}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? res.data : c))
      );
      setEditRow(null);
      setEditName("");
    } catch (err) {
      console.error("Failed to update category:", err.response || err);
      setError("Failed to update category.");
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${API_BASE}/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err) {
      console.error("Failed to delete category:", err.response || err);
      setError("Failed to delete category.");
    }
  };

  const filteredCategories = !searchQuery
    ? categories
    : categories.filter((c) =>
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      );

  return {
    categories: filteredCategories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    newCategory,
    setNewCategory,
    handleCreate,
    editRow,
    setEditRow,
    editName,
    setEditName,
    handleUpdate,
    handleDelete,
    expandedRow,
    setExpandedRow,
  };
};

const CategoriesTable = ({
  categories,
  editRow,
  setEditRow,
  editName,
  setEditName,
  handleUpdate,
  handleDelete,
  expandedRow,
  setExpandedRow,
}) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y border-[var(--border)]">
        <thead className="bg-[var(--muted)]">
          <tr>
            {["Category Name", "Actions"].map((title) => (
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
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-center text-sm text-[var(--muted-foreground)]"
              >
                No categories found.
              </td>
            </tr>
          ) : (
            categories.flatMap((cat) => {
              const isEditing = editRow === cat.id;
              const isExpanded = expandedRow === cat.id;

              const row = (
                <tr
                  key={`${cat.id}-row`}
                  className="hover:bg-[var(--accent)]/20 cursor-pointer transition-colors"
                  onClick={() =>
                    setExpandedRow(isExpanded ? null : cat.id)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="!shadow-none text-black"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(cat.id)}
                          className="bg-[var(--accent)] text-[var(--accent-foreground)]"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditRow(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditRow(cat.id);
                            setEditName(cat.name);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.id);
                          }}
                          className="bg-[var(--primary)] text-[var(--secondary)] hover:bg-[var(--accent)]"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );

              const detailsRow = isExpanded ? (
                <tr key={`${cat.id}-details`} className="bg-[var(--muted)]">
                  <td colSpan={2} className="px-6 py-4 text-black text-sm">
                    <p><strong>Category ID:</strong> {cat.id}</p>
                    <p><strong>Created At:</strong> {cat.created_at ? new Date(cat.created_at).toLocaleString() : "N/A"}</p>
                    <p><strong>Updated At:</strong> {cat.updated_at ? new Date(cat.updated_at).toLocaleString() : "N/A"}</p>
                  </td>
                </tr>
              ) : null;

              return [row, detailsRow].filter(Boolean);
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function CategoriesSection() {
  const {
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    newCategory,
    setNewCategory,
    handleCreate,
    editRow,
    setEditRow,
    editName,
    setEditName,
    handleUpdate,
    handleDelete,
    expandedRow,
    setExpandedRow,
  } = useCategoriesState();

  return (
    <div className="space-y-6 bg-background min-h-screen p-4">
      <Card className="p-4 rounded-2xl shadow hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-semibold text-black">Categories</h3>
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!shadow-none max-w-xs text-black"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="!shadow-none text-black"
          />
          <Button onClick={handleCreate}>Add</Button>
        </div>

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading categories...</p>
        ) : error ? (
          <p className="text-[var(--destructive)]">{error}</p>
        ) : (
          <CategoriesTable
            categories={categories}
            editRow={editRow}
            setEditRow={setEditRow}
            editName={editName}
            setEditName={setEditName}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
          />
        )}
      </Card>
    </div>
  );
}
