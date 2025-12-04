import React from 'react';
import { LOCATIONS, LocationType } from '../types';

interface SidebarProps {
  currentLocation: LocationType;
  onSelectLocation: (loc: LocationType) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentLocation, 
  onSelectLocation,
  isAdmin,
  onToggleAdmin
}) => {
  return (
    <div className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 flex flex-col h-auto md:h-full shadow-sm md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="p-4 md:p-8 md:pb-4 flex items-center justify-between md:block">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span className="text-blue-600">❄️</span> 青秋旅行
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 font-medium ml-7 md:ml-8">酒店查询助手</p>
        </div>
        
        {/* Mobile Admin Toggle */}
        <button
          onClick={onToggleAdmin}
          className={`md:hidden text-xs font-bold px-3 py-1.5 rounded-lg transition-all
            ${isAdmin 
              ? 'bg-red-50 text-red-500' 
              : 'bg-gray-100 text-gray-600'
            }`}
        >
          {isAdmin ? '退出管理' : '管理'}
        </button>
      </div>

      <nav className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto px-4 pb-3 md:pb-2 md:pt-2 space-x-2 md:space-x-0 md:space-y-1 flex md:block scrollbar-hide">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => onSelectLocation(loc)}
            className={`flex-shrink-0 whitespace-nowrap text-left px-4 py-2 md:px-5 md:py-3.5 rounded-full md:rounded-xl transition-all duration-300 flex items-center justify-between group
              ${currentLocation === loc 
                ? 'bg-black text-white shadow-lg shadow-gray-200 transform scale-[1.02]' 
                : 'bg-gray-50 md:bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <span className="font-semibold text-sm md:text-base">{loc}</span>
            {currentLocation === loc && (
              <span className="text-xs md:text-sm hidden md:inline">●</span>
            )}
          </button>
        ))}
      </nav>

      {/* Desktop Admin Toggle */}
      <div className="hidden md:block p-6 border-t border-gray-100">
        <button
          onClick={onToggleAdmin}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300
            ${isAdmin 
              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
        >
          {isAdmin ? '退出管理模式' : '进入管理模式'}
        </button>
      </div>
    </div>
  );
};