import { usePromoCodes } from '@/hooks/usePromoCodes';
import { CreatePromoCodeRequest } from '@/types';
import React, { useEffect, useState } from 'react';

const PromoCodeManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePromoCodeRequest>({
    expiration_duration: 10,
    usage_limit: 5,
  });

  const {
    currentPromoCodes,
    promoCodes,
    currentPage,
    searchTerm,
    totalPages,
    isLoading,
    error,
    fetchPromoCodes,
    createPromoCode,
    editPromoCode,
    deletePromoCode,
    togglePromoCodeStatus,
    setCurrentPage,
    setSearchTerm,
  } = usePromoCodes();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPromoCode(formData);
      setShowCreateModal(false);
      setFormData({ expiration_duration: 10, usage_limit: 5 });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromoCode) return;

    try {
      await editPromoCode(editingPromoCode, formData);
      setShowEditModal(false);
      setEditingPromoCode(null);
      setFormData({ expiration_duration: 10, usage_limit: 5 });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEdit = (promoCode: any) => {
    setEditingPromoCode(promoCode.id);
    // Calculate days until expiration
    const expirationDate = new Date(promoCode.expiration_date);
    const currentDate = new Date();
    const timeDiff = expirationDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    setFormData({
      expiration_duration: daysDiff > 0 ? daysDiff : 1,
      usage_limit: promoCode.usage_limit,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (promoId: string) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      await deletePromoCode(promoId);
    }
  };

  const handleToggleStatus = async (promoId: string) => {
    await togglePromoCodeStatus(promoId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Promo Code Management
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Create Promo Code
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Active Codes
          </h3>
          <p className="text-3xl font-bold text-emerald-600">
            {
              promoCodes.filter(
                p => !p.deleted && !isExpired(p.expiration_date)
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Codes
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {promoCodes.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Expired/Deleted
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {
              promoCodes.filter(p => p.deleted || isExpired(p.expiration_date))
                .length
            }
          </p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search promo codes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading promo codes...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPromoCodes.map(promo => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {promo.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {promo.usage_limit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(promo.expiration_date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(promo.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        promo.deleted
                          ? 'bg-gray-100 text-gray-800'
                          : isExpired(promo.expiration_date)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {promo.deleted
                        ? 'Deleted'
                        : isExpired(promo.expiration_date)
                        ? 'Expired'
                        : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(promo.id)}
                      className={`${
                        promo.deleted
                          ? 'text-green-600 hover:text-green-900'
                          : 'text-red-600 hover:text-red-900'
                      }`}
                    >
                      {promo.deleted ? 'Restore' : 'Delete'}
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Promo Code</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expiration_duration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      expiration_duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 10 (expires in 10 days)"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usage_limit}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      usage_limit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Promo Code</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Duration (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.expiration_duration}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      expiration_duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 10 (expires in 10 days)"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usage_limit}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      usage_limit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPromoCode(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeManagement;
