import React, { useState } from 'react';

interface BingoCard {
  id: string;
  title: string;
  category: string;
  color: string;
  image: string;
  description: string;
  isActive: boolean;
}

const BingoCardManagement: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Weight-Loss',
    'Mental Health',
    'Fitness',
    'Nutrition',
  ];

  const bingoCards: BingoCard[] = [
    {
      id: '1',
      title: 'Weight Loss Challenge',
      category: 'Weight-Loss',
      color: 'orange',
      image:
        'https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106342580_58cb608c.webp',
      description: 'Complete daily fitness and nutrition goals',
      isActive: true,
    },
    {
      id: '2',
      title: 'Fitness Fundamentals',
      category: 'Weight-Loss',
      color: 'green',
      image:
        'https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106344377_adad46ae.webp',
      description: 'Build healthy exercise habits',
      isActive: true,
    },
    {
      id: '3',
      title: 'Healthy Eating',
      category: 'Weight-Loss',
      color: 'red',
      image:
        'https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106346116_d8eb3bc7.webp',
      description: 'Develop nutritious meal patterns',
      isActive: false,
    },
    {
      id: '4',
      title: 'Mindfulness Journey',
      category: 'Mental Health',
      color: 'blue',
      image:
        'https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106354194_b99183d1.webp',
      description: 'Practice daily meditation and mindfulness',
      isActive: true,
    },
    {
      id: '5',
      title: 'Stress Relief',
      category: 'Mental Health',
      color: 'purple',
      image:
        'https://d64gsuwffb70l.cloudfront.net/68bb5074d29f4ea4e372ac3c_1757106356028_71095601.webp',
      description: 'Learn stress management techniques',
      isActive: true,
    },
  ];

  const filteredCards =
    selectedCategory === 'all'
      ? bingoCards
      : bingoCards.filter(card => card.category === selectedCategory);

  const toggleCardStatus = (cardId: string) => {
    alert(`Toggle status for card ${cardId}`);
  };

  const editCard = (cardId: string) => {
    alert(`Edit card ${cardId}`);
  };

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this bingo card?')) {
      alert(`Delete card ${cardId}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bingo Card Management
        </h1>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">
          + Create New Card
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map(card => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    card.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {card.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{card.category}</p>
              <p className="text-gray-700 mb-4">{card.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full bg-${card.color}-500`}
                  ></div>
                  <span className="text-sm text-gray-600 capitalize">
                    {card.color} theme
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => toggleCardStatus(card.id)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium ${
                    card.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {card.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => editCard(card.id)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No bingo cards found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};

export default BingoCardManagement;
