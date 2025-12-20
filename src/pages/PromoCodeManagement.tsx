import { usePromoCodes } from '@/hooks/usePromoCodes';
import { CreatePromoCodeRequest } from '@/types';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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
        <h1 className="text-3xl font-bold text-primary-blue">
          Promo Code Management
        </h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search promo codes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
          />
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primaryGreen"
            size="pill"
          >
            + Create Promo Code
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading promo codes...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-light-medium">
          <table className="min-w-full divide-y divide-gray-light-medium">
            <thead className="bg-gray-very-light">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Usage Limit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-very-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-light-medium">
              {currentPromoCodes.map(promo => (
                <tr key={promo.id} className="hover:bg-gray-very-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-text-primary font-mono bg-gray-light px-2 py-1 rounded">
                      {promo.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {promo.usage_limit}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {formatDate(promo.expiration_date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {formatDate(promo.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        promo.deleted
                          ? 'bg-gray-light text-gray-very-dark'
                          : isExpired(promo.expiration_date)
                          ? 'bg-red-100 text-error'
                          : 'bg-bingo-mint text-bingo-forest'
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
                      className="text-bingo-sky hover:text-bingo-navy transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(promo.id)}
                      className={`transition-colors ${
                        promo.deleted
                          ? 'text-success hover:text-bingo-forest'
                          : 'text-error hover:text-red-700'
                      }`}
                    >
                      {promo.deleted ? 'Restore' : 'Delete'}
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
              className={`px-3 py-2 rounded-full transition-all ${
                currentPage === page
                  ? 'bg-primary-green text-white'
                  : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-primary-blue mb-4">Create New Promo Code</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
                  placeholder="e.g., 10 (expires in 10 days)"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary-green text-white py-2 px-4 rounded-full hover:bg-bingo-forest disabled:opacity-50 transition-all font-medium"
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-light text-text-primary py-2 px-4 rounded-full hover:bg-gray-light-medium transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-primary-blue mb-4">Edit Promo Code</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
                  placeholder="e.g., 10 (expires in 10 days)"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                  className="w-full px-3 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary-green text-white py-2 px-4 rounded-full hover:bg-bingo-forest disabled:opacity-50 transition-all font-medium"
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPromoCode(null);
                  }}
                  className="flex-1 bg-gray-light text-text-primary py-2 px-4 rounded-full hover:bg-gray-light-medium transition-all font-medium"
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
