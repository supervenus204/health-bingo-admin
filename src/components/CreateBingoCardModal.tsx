import { CreateBingoCardRequest, ChallengeCategory } from '@/types';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateBingoCardModalProps {
  isOpen: boolean;
  formData: CreateBingoCardRequest;
  categories: ChallengeCategory[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: CreateBingoCardRequest) => void;
}

const availableBackgroundColors = [
  { name: 'coral', value: '#EF476F' },
  { name: 'violet', value: '#8A74ED' },
  { name: 'sky', value: '#5DA9E9' },
  { name: 'lime', value: '#7ED957' },
  { name: 'mint', value: '#B7F4B9' },
  { name: 'gold', value: '#FFD700' },
  { name: 'forest', value: '#07901E' },
  { name: 'navy', value: '#03264F' },
  { name: 'white', value: '#FFFFFF' },
  { name: 'black', value: '#000000' },
];

const availableFontColors = [
  { name: 'white', value: '#FFFFFF' },
  { name: 'black', value: '#000000' },
];

export const CreateBingoCardModal: React.FC<CreateBingoCardModalProps> = ({
  isOpen,
  formData,
  categories,
  isLoading,
  onClose,
  onSubmit,
  onFormDataChange,
}) => {
  if (!isOpen) return null;

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      onFormDataChange({
        ...formData,
        category_ids: [...formData.category_ids, categoryId],
      });
    } else {
      onFormDataChange({
        ...formData,
        category_ids: formData.category_ids.filter(id => id !== categoryId),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-primary-blue mb-6">
          Add Custom Card
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: formData.color }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: formData.font_color,
                  }}
                >
                  {formData.name || 'Card'}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-blue mb-2">
              Card Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-light-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all"
              placeholder="Enter card name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-blue mb-3">
              Background Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {availableBackgroundColors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    onFormDataChange({ ...formData, color: color.value })
                  }
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-primary-blue scale-110'
                      : 'border-gray-light-medium hover:border-gray-medium'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {formData.color === color.value && (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-6 h-6"
                        style={{
                          color:
                            color.value === '#FFFFFF' || color.value === '#B7F4B9'
                              ? '#03264F'
                              : '#FFFFFF',
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-blue mb-3">
              Font Color
            </label>
            <div className="flex gap-3">
              {availableFontColors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    onFormDataChange({ ...formData, font_color: color.value })
                  }
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    formData.font_color === color.value
                      ? 'border-primary-blue scale-110'
                      : 'border-gray-light-medium hover:border-gray-medium'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {formData.font_color === color.value && (
                    <div className="flex items-center justify-center h-full">
                      <svg
                        className="w-6 h-6"
                        style={{ color: color.value === '#FFFFFF' ? '#03264F' : '#FFFFFF' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-blue mb-2">
              Categories
            </label>
            <div className="border border-gray-light-medium rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto focus-within:ring-2 focus-within:ring-primary-green focus-within:border-primary-green transition-all">
              {categories.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-light/50 rounded px-2 transition-colors"
                >
                  <Checkbox
                    checked={formData.category_ids.includes(cat.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(cat.id, checked === true)
                    }
                  />
                  <span className="text-sm text-text-primary">{cat.name}</span>
                </label>
              ))}
            </div>
            {formData.category_ids.length === 0 && (
              <p className="text-xs text-error mt-1">
                Please select at least one category
              </p>
            )}
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
              onClick={onClose}
              className="flex-1 bg-gray-light text-text-primary py-2 px-4 rounded-full hover:bg-gray-light-medium transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

