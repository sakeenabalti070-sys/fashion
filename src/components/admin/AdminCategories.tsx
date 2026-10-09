import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, FolderTree, Tag, Check } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, addSubcategory, brands, addBrand, showToast } =
    useStore();

  const [newCatName, setNewCatName] = useState('');
  const [newCatSubs, setNewCatSubs] = useState('');
  const [activeCatIdForSub, setActiveCatIdForSub] = useState<string | null>(null);
  const [subInput, setSubInput] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const subs = newCatSubs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    addCategory(newCatName.trim(), subs.length > 0 ? subs : ['General Essentials']);
    setNewCatName('');
    setNewCatSubs('');
  };

  const handleAddSub = (catId: string) => {
    if (!subInput.trim()) return;
    addSubcategory(catId, subInput.trim());
    setSubInput('');
    setActiveCatIdForSub(null);
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    addBrand(newBrandName.trim());
    setNewBrandName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
          Taxonomy: Categories, Subcategories & Brands
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Organize your product hierarchy with unlimited multi-level navigation trees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories List (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif-display text-lg font-bold text-neutral-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-neutral-800" />
              <span>Active Department Trees</span>
            </h2>
          </div>

          {/* Create Category Form */}
          <form onSubmit={handleCreateCategory} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-3">
            <span className="font-semibold text-neutral-900 block">Create New Department / Category</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Couture & Bridal"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">Subcategories (comma separated)</label>
                <input
                  type="text"
                  placeholder="Heavy Bridals, Formal Angrakhas, Maxi Lehengas"
                  value={newCatSubs}
                  onChange={(e) => setNewCatSubs(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded bg-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 cursor-pointer shadow-xs"
            >
              Add Department
            </button>
          </form>

          {/* Categories Grid */}
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{cat.name}</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">Slug: /{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${cat.name}?`)) deleteCategory(cat.id);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subcategories tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {cat.subcategories.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium"
                    >
                      {sub}
                    </span>
                  ))}

                  {activeCatIdForSub === cat.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Subcategory name..."
                        value={subInput}
                        onChange={(e) => setSubInput(e.target.value)}
                        className="text-xs p-1 border border-neutral-300 rounded"
                      />
                      <button
                        onClick={() => handleAddSub(cat.id)}
                        className="px-2 py-1 bg-neutral-900 text-white rounded text-xs cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setActiveCatIdForSub(null)}
                        className="px-1.5 py-1 text-xs text-neutral-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveCatIdForSub(cat.id)}
                      className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-900 border border-dashed border-neutral-300 rounded hover:border-neutral-500 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Subcategory</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Brands Registry (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-neutral-800" />
            <span>Authorized Brands</span>
          </h2>

          <form onSubmit={handleCreateBrand} className="space-y-2 text-xs">
            <input
              type="text"
              required
              placeholder="e.g. Maison Elan"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded bg-white"
            />
            <button
              type="submit"
              className="w-full py-2 font-semibold uppercase tracking-wider text-xs text-white bg-neutral-900 rounded hover:bg-neutral-800 cursor-pointer"
            >
              Register Brand Label
            </button>
          </form>

          <div className="divide-y divide-neutral-100 text-xs">
            {brands.map((b, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-neutral-800 font-medium">
                <span>{b}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
