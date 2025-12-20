import { useBingoCards } from '@/hooks/useBingoCards';
import { CreateBingoCardRequest } from '@/types';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { BingoCardItem } from '@/components/BingoCardItem';
import { CreateBingoCardModal } from '@/components/CreateBingoCardModal';

const BingoCardManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateBingoCardRequest>({
    name: '',
    color: '#EF476F',
    category_ids: [],
    font_color: '#FFFFFF',
    font_name: 'Arial',
  });

  const {
    currentBingoCards,
    bingoCards,
    currentPage,
    searchTerm,
    selectedCategory,
    totalPages,
    isLoading,
    error,
    categories,
    isLoadingCategories,
    fetchBingoCards,
    createBingoCard,
    deleteBingoCard,
    setCurrentPage,
    setSearchTerm,
    setSelectedCategory,
  } = useBingoCards();

  const isSearchTriggeredRef = useRef(false);
  const selectedCategoryRef = useRef(selectedCategory);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    if (!isSearchTriggeredRef.current) {
      fetchBingoCards(
        selectedCategory === 'all' ? undefined : selectedCategory,
        currentPage,
        searchTerm || undefined
      );
    }
    isSearchTriggeredRef.current = false;
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        isSearchTriggeredRef.current = true;
      }
      fetchBingoCards(
        selectedCategoryRef.current === 'all' ? undefined : selectedCategoryRef.current,
        searchTerm ? 1 : currentPageRef.current,
        searchTerm || undefined
      );
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const categoryOptions = [
    { id: 'all', name: 'All' },
    ...categories.map(cat => ({ id: cat.id, name: cat.name })),
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category_ids.length === 0) {
      return;
    }
    try {
      await createBingoCard(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        color: '#EF476F',
        category_ids: [],
        font_color: '#FFFFFF',
        font_name: 'Arial',
      });
      await fetchBingoCards(selectedCategory === 'all' ? undefined : selectedCategory, currentPage);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      name: '',
      color: '#EF476F',
      category_ids: [],
      font_color: '#FFFFFF',
      font_name: 'Arial',
    });
  };

  const handleDelete = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this bingo card?')) {
      try {
        await deleteBingoCard(cardId);
        await fetchBingoCards(selectedCategory === 'all' ? undefined : selectedCategory, currentPage);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-blue">
          Bingo Card Management
        </h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search bingo cards..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
          />
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primaryGreen"
            size="pill"
          >
            + Create New Card
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        {isLoadingCategories ? (
          <div className="text-sm text-text-secondary">Loading categories...</div>
        ) : (
          categoryOptions.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-green text-white'
                  : 'bg-gray-light text-text-primary hover:bg-gray-light-medium'
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
            {currentBingoCards.map(card => (
              <BingoCardItem
                key={card.id}
                card={card}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {currentBingoCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No bingo cards found.
              </p>
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
        </>
      )}

      <CreateBingoCardModal
        isOpen={showCreateModal}
        formData={formData}
        categories={categories}
        isLoading={isLoading}
        onClose={handleCloseModal}
        onSubmit={handleCreateSubmit}
        onFormDataChange={setFormData}
      />

    </div>
  );
};

export default BingoCardManagement;
