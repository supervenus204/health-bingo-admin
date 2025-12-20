import { BingoCard } from '@/types';
import React from 'react';
import { Trash2 } from 'lucide-react';

interface BingoCardItemProps {
  card: BingoCard;
  onDelete: (id: string) => void;
}

export const BingoCardItem: React.FC<BingoCardItemProps> = ({ card, onDelete }) => {
  return (
    <div className="relative group">
      <div
        className="w-full aspect-square rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer"
        style={{ backgroundColor: card.color }}
      >
        <div
          className="text-xs font-bold text-center px-1 leading-tight"
          style={{
            color: card.font_color,
            fontFamily: card.font_name,
          }}
        >
          {card.name}
        </div>
      </div>
      <button
        onClick={() => onDelete(card.id)}
        className="absolute top-1 right-1 w-5 h-5 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3 text-error" />
      </button>
    </div>
  );
};

