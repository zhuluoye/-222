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
    <div className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 flex-shrink-0 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span className="text-blue-600">❄️</span> 青秋旅行
        </h1>
        <p className="text-gray-400 text-sm mt-1 font-medium ml-8">酒店查询助手</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => onSelectLocation(loc)}
            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group
              ${currentLocation === loc 
                ? 'bg-black text-white shadow-lg shadow-gray-200 transform scale-[1.02]' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <span className="font-semibold">{loc}</span>
            {currentLocation === loc && (
              <span className="text-sm">●</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100">
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