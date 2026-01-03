"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseCounts, setCourseCounts] = useState({});

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.push("/programs");
      return;
    }

    fetchCategories();
    fetchCourseCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseCounts = async () => {
    try {
      const response = await fetch("/api/courses?limit=1000");
      const data = await response.json();

      if (data.success) {
        const counts = {};
        data.data.forEach((course) => {
          const categoryId = course.category?._id || "none";
          counts[categoryId] = (counts[categoryId] || 0) + 1;
        });
        setCourseCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching course counts:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setSuccess(
        editingCategory
          ? "Category updated successfully!"
          : "Category created successfully!"
      );
      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
      fetchCourseCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (categoryName === "Other") {
      setError('Cannot delete the default "Other" category');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete this category? All courses in this category will be moved to "Other".`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setSuccess("Category deleted successfully!");
      fetchCategories();
      fetchCourseCounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    resetForm();
    setError("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary/70">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-primary mb-2">
              Manage Categories
            </h1>
            <p className="text-sm text-primary/70">
              Create and manage course categories
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary hover:bg-secondary-light/60 transition-colors"
            >
              Back to Dashboard
            </Link>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-primary text-secondary-light px-4 py-2 text-sm font-semibold hover:bg-primary-light transition-colors"
              >
                Create New Category
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {success}
          </div>
        )}

        {showForm && (
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Programming, Business, Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={200}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Optional description for this category"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-primary hover:bg-secondary-light/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary text-secondary-light px-4 py-2 text-sm font-semibold hover:bg-primary-light transition-colors"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-surface border border-border rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-primary">
                      {category.name}
                    </h3>
                    {category.name === "Other" && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-primary/80 mb-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-primary/70">
                    <span>
                      {courseCounts[category._id] || 0}{" "}
                      {courseCounts[category._id] === 1 ? "course" : "courses"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary-light/60 transition-colors"
                  >
                    Edit
                  </button>
                  {category.name !== "Other" && (
                    <button
                      onClick={() =>
                        handleDelete(category._id, category.name)
                      }
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-primary/70 mb-4">No categories yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-full bg-primary text-secondary-light px-6 py-2 text-sm font-semibold hover:bg-primary-light transition-colors"
              >
                Create Your First Category
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
