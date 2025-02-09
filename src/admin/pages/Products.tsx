import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Plus, Upload, X } from 'lucide-react';
import { api } from '../../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'beans' | 'equipment' | 'accessories';
  weight?: string;
  origin?: string;
  roastLevel?: 'light' | 'medium' | 'dark';
  stock: number;
  details?: {
    flavor?: string[];
    process?: string;
    altitude?: string;
    brewingTips?: string[];
    storageInstructions?: string;
  };
}

const getImageUrl = (imageUrl: string) => {
  return imageUrl.startsWith('http') 
    ? imageUrl 
    : `http://localhost:5000${imageUrl}`;
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please select a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError('Image file size must be less than 5MB');
      return false;
    }

    setImageError('');
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateImageFile(file)) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      formData.append('productData', JSON.stringify(editingProduct));

      if (editingProduct?._id) {
        const updatedProduct = await api.updateProduct(editingProduct._id, formData);
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      } else {
        const newProduct = await api.createProduct(formData);
        setProducts([newProduct, ...products]);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      details: {
        ...prev?.details,
        [name]: value
      }
    }));
  };

  const handleFlavorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const flavors = e.target.value.split(',').map(flavor => flavor.trim());
    setEditingProduct(prev => ({
      ...prev,
      details: {
        ...prev?.details,
        flavor: flavors
      }
    }));
  };

  const handleBrewingTipsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tips = e.target.value.split('\n').filter(tip => tip.trim());
    setEditingProduct(prev => ({
      ...prev,
      details: {
        ...prev?.details,
        brewingTips: tips
      }
    }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setEditingProduct({
              name: '',
              description: '',
              price: 0,
              image: '',
              category: 'beans',
              stock: 0,
              details: {}
            });
            setIsModalOpen(true);
            setSelectedFile(null);
            setPreviewUrl('');
            setImageError('');
          }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-md object-contain bg-gray-100"
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                          setPreviewUrl(`http://localhost:5000${product.image}`);
                          setSelectedFile(null);
                          setImageError('');
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingProduct?._id ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProduct(null);
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct?.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={editingProduct?.category || 'beans'}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                  >
                    <option value="beans">Coffee Beans</option>
                    <option value="equipment">Equipment</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct?.price || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct?.stock || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingProduct?.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WebP (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    {imageError && (
                      <p className="mt-2 text-sm text-red-600">{imageError}</p>
                    )}
                  </div>
                  <div>
                    {(previewUrl || editingProduct?.image) && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={previewUrl || getImageUrl(editingProduct?.image || '')}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editingProduct?.category === 'beans' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Origin</label>
                      <input
                        type="text"
                        name="origin"
                        value={editingProduct?.origin || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Roast Level</label>
                      <select
                        name="roastLevel"
                        value={editingProduct?.roastLevel || 'medium'}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                      >
                        <option value="light">Light</option>
                        <option value="medium">Medium</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Flavors (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="flavor"
                      value={editingProduct?.details?.flavor?.join(', ') || ''}
                      onChange={handleFlavorChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                      placeholder="e.g., Chocolate, Nutty, Citrus"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Process</label>
                    <input
                      type="text"
                      name="process"
                      value={editingProduct?.details?.process || ''}
                      onChange={handleDetailsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Altitude</label>
                    <input
                      type="text"
                      name="altitude"
                      value={editingProduct?.details?.altitude || ''}
                      onChange={handleDetailsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brewing Tips (one per line)
                </label>
                <textarea
                  name="brewingTips"
                  value={editingProduct?.details?.brewingTips?.join('\n') || ''}
                  onChange={handleBrewingTipsChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-600 focus:ring focus:ring-primary-600 focus:ring-opacity-50"
                  placeholder="Enter each brewing tip on a new line"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setImageError('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingProduct?._id ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}