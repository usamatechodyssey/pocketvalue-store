// /app/admin/categories/page.tsx - SIRF STYLING UPDATE

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle, Edit, Trash2, X } from "lucide-react";
import {
  Category,
  getAllCategories,
  upsertCategory,
  deleteCategory,
} from "./_actions/categoryActions";

// === Form Modal Component (Updated) ===
function CategoryFormModal({
  isOpen,
  onClose,
  category,
  allCategories,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Partial<Category> | null;
  allCategories: Category[];
}) {
  if (!isOpen) return null;

  const isEditMode = !!category?._id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.loading(isEditMode ? "Updating..." : "Creating...");
    const result = await upsertCategory(formData);
    toast.dismiss();
    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface-base p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {isEditMode ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-input text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditMode && (
            <input type="hidden" name="id" value={category?._id} />
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-primary"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={category?.name}
              className="mt-1 w-full p-2 border border-surface-border-darker bg-surface-base rounded-md focus:ring-brand-primary focus:border-brand-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-text-primary"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={category?.slug?.current}
              className="mt-1 w-full p-2 border border-surface-border-darker bg-surface-base rounded-md focus:ring-brand-primary focus:border-brand-primary"
              required
            />
          </div>
          <div>
            <label
              htmlFor="parentId"
              className="block text-sm font-medium text-text-primary"
            >
              Parent Category
            </label>
            <select
              id="parentId"
              name="parentId"
              defaultValue={category?.parent?._id}
              className="mt-1 w-full p-2 border border-surface-border-darker rounded-md bg-surface-base focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="">-- No Parent --</option>
              {allCategories
                .filter((c) => c._id !== category?._id)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-input text-text-primary rounded-md hover:bg-surface-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary text-on-primary rounded-md hover:bg-brand-primary-hover"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// === Main Page Component (Updated) ===
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Partial<Category> | null>(null);

  const fetchCategories = async () => {
    const fetchedCategories = await getAllCategories();
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, [isModalOpen]);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      toast.loading("Deleting...");
      const result = await deleteCategory(category._id);
      toast.dismiss();
      if (result.success) {
        toast.success(result.message);
        fetchCategories();
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Manage Categories</h1>{" "}
        {/* font-bold aur color base se aayega */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-on-primary rounded-md hover:bg-brand-primary-hover"
        >
          <PlusCircle size={20} />
          Add New
        </button>
      </div>

      <div className="bg-surface-base p-6 rounded-lg shadow-md border border-surface-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-ground">
              <tr>
                <th className="p-3 text-left font-semibold text-text-primary">
                  Name
                </th>
                <th className="p-3 text-left font-semibold text-text-primary">
                  Parent
                </th>
                <th className="p-3 text-left font-semibold text-text-primary">
                  Sub-Categories
                </th>
                <th className="p-3 text-right font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-surface-border">
                  <td className="p-3 font-medium text-text-primary">
                    {cat.name}
                    <p className="text-xs text-text-subtle">
                      Slug: {cat.slug.current}
                    </p>
                  </td>
                  <td className="p-3 text-sm text-text-secondary">
                    {cat.parent?.name || "--"}
                  </td>
                  <td className="p-3 text-text-secondary">
                    {cat.subCategoryCount}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="text-brand-danger hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        allCategories={categories}
      />
    </div>
  );
}
