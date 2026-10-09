import React, { useState } from 'react';
import { Product, ProductVariation } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  X,
  Check,
  Package,
} from 'lucide-react';
import {
  HERO_IMAGE,
  PRODUCT_ABAYA_IMG,
  PRODUCT_MENS_LINEN_IMG,
  PRODUCT_LEATHER_TOTE_IMG,
} from '../../data/initialData';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    brands,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    togglePublishProduct,
    formatPrice,
    showToast,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || "Women's Fashion",
    subcategory: categories[0]?.subcategories[0] || 'Abayas & Kaftans',
    brand: brands[0] || 'AURA Atelier',
    basePrice: 12000,
    salePrice: 0,
    sku: 'AUR-NEW-01',
    description: '',
    shortDescription: '',
    material: '100% Pure Silk',
    careInstructions: 'Dry clean only',
    featuredImage: PRODUCT_ABAYA_IMG,
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Black Onyx', hex: '#1C1C1E' }],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    lowStockThreshold: 5,
  });

  const availableSampleImages = [
    PRODUCT_ABAYA_IMG,
    PRODUCT_MENS_LINEN_IMG,
    PRODUCT_LEATHER_TOTE_IMG,
    HERO_IMAGE,
  ];

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.name || "Women's Fashion",
      subcategory: categories[0]?.subcategories[0] || 'Abayas & Kaftans',
      brand: brands[0] || 'AURA Atelier',
      basePrice: 12000,
      salePrice: 0,
      sku: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      description: 'Handcrafted luxury piece designed and finished in our master atelier.',
      shortDescription: 'Tailored luxury fashion with artisanal attention to detail.',
      material: '100% Pure Silk & Linen Blend',
      careInstructions: 'Dry clean only with organic solvent.',
      featuredImage: PRODUCT_ABAYA_IMG,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Onyx Black', hex: '#1C1C1E' },
        { name: 'Pearl Chalk', hex: '#F4F2EC' },
      ],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      lowStockThreshold: 5,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      basePrice: product.basePrice,
      salePrice: product.salePrice || 0,
      sku: product.sku,
      description: product.description,
      shortDescription: product.shortDescription,
      material: product.material,
      careInstructions: product.careInstructions,
      featuredImage: product.featuredImage,
      sizes: product.sizes,
      colors: product.colors,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      lowStockThreshold: product.lowStockThreshold,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      showToast('Please provide product name and SKU', 'error');
      return;
    }

    // Generate variations based on sizes and colors
    const generatedVariations: ProductVariation[] = [];
    formData.sizes.forEach((sz, sIdx) => {
      formData.colors.forEach((col, cIdx) => {
        generatedVariations.push({
          id: `var-${Date.now()}-${sIdx}-${cIdx}`,
          size: sz,
          color: col.name,
          colorHex: col.hex,
          sku: `${formData.sku}-${sz}-${col.name.substring(0, 3).toUpperCase()}`,
          price: formData.salePrice > 0 ? formData.salePrice : formData.basePrice,
          salePrice: formData.salePrice > 0 ? formData.salePrice : undefined,
          stock: 8,
        });
      });
    });

    const totalCalculatedStock = generatedVariations.reduce((sum, v) => sum + v.stock, 0);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice > 0 ? Number(formData.salePrice) : undefined,
        sku: formData.sku,
        description: formData.description,
        shortDescription: formData.shortDescription,
        material: formData.material,
        careInstructions: formData.careInstructions,
        featuredImage: formData.featuredImage,
        images: [formData.featuredImage],
        sizes: formData.sizes,
        colors: formData.colors,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        lowStockThreshold: Number(formData.lowStockThreshold),
      });
    } else {
      addProduct({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        subcategory: formData.subcategory,
        brand: formData.brand,
        description: formData.description,
        shortDescription: formData.shortDescription,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice > 0 ? Number(formData.salePrice) : undefined,
        images: [formData.featuredImage],
        featuredImage: formData.featuredImage,
        sizes: formData.sizes,
        colors: formData.colors,
        variations: generatedVariations,
        totalStock: totalCalculatedStock,
        lowStockThreshold: Number(formData.lowStockThreshold),
        sku: formData.sku,
        material: formData.material,
        careInstructions: formData.careInstructions,
        tags: [formData.category, formData.brand, 'Luxury'],
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        isPublished: true,
        rating: 5.0,
        reviewsCount: 1,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
            Products & Variations Catalogue
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage physical garment inventory, SKUs, fabric compositions, and pricing matrix.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category & Brand</th>
                <th className="py-3 px-6 font-mono">Base Price</th>
                <th className="py-3 px-6 text-center">Stock Units</th>
                <th className="py-3 px-6 text-center">Sizes</th>
                <th className="py-3 px-6 text-center">Visibility</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="w-12 h-14 object-cover rounded-lg bg-neutral-100 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 line-clamp-1">{product.name}</p>
                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-neutral-900">{product.category}</p>
                    <p className="text-[11px] text-neutral-500">{product.brand}</p>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-neutral-900 tabular-nums">
                    {formatPrice(product.salePrice ?? product.basePrice)}
                    {product.salePrice && (
                      <span className="block text-[10px] text-neutral-400 line-through">
                        {formatPrice(product.basePrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-mono">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        product.totalStock <= 0
                          ? 'bg-rose-100 text-rose-800'
                          : product.totalStock <= product.lowStockThreshold
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {product.totalStock} units
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.sizes.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 bg-neutral-100 text-[10px] rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => togglePublishProduct(product.id)}
                      className="cursor-pointer"
                      title={product.isPublished ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                    >
                      {product.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <Eye className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-neutral-400 font-semibold text-[11px]">
                          <EyeOff className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-100 cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateProduct(product.id)}
                      className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-100 cursor-pointer"
                      title="Duplicate Product"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${product.name}?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-neutral-100 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-neutral-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Atelier Piece'}
                </h3>
                <p className="text-xs text-neutral-500">Configure fabric specifications, pricing, and sizes.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded hover:bg-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-neutral-700 font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Emerald Embroidered Silk Abaya"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-neutral-700 font-semibold mb-1">Master SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. ABY-EMR-001"
                    className="w-full font-mono p-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Base Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full p-2.5 font-mono border border-neutral-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Sale / Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full p-2.5 font-mono border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Select Visual Asset</label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSampleImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setFormData({ ...formData, featuredImage: img })}
                        className={`aspect-3/4 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          formData.featuredImage === img ? 'border-neutral-900 ring-2 ring-neutral-400' : 'border-neutral-200'
                        }`}
                      >
                        <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Material & Craftsmanship</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="100% Japanese Silk Chiffon with Zari Threading"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 cursor-pointer shadow-sm"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
