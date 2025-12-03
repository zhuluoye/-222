import React from 'react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onClick: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  return (
    <div 
      onClick={() => onClick(hotel)}
      className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer border border-gray-100 p-6 flex flex-col h-full transform hover:-translate-y-1 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
          {hotel.name}
        </h3>
        <span className="flex items-center justify-center bg-blue-50 text-blue-600 w-12 h-8 rounded-lg text-sm font-bold">
          {hotel.rating.toFixed(1)}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
         <div className="flex text-yellow-400 text-sm">
           {'★'.repeat(hotel.stars)}
           {'☆'.repeat(5 - hotel.stars)}
         </div>
         <span className="text-gray-400 text-xs">{hotel.stars}星级</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {hotel.tags.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="text-xs font-medium text-gray-500 bg-gray-100/80 px-2.5 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
        <span className="text-9xl transform translate-x-4 translate-y-4 inline-block">🏢</span>
      </div>
    </div>
  );
};