import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { HotelCard } from './components/HotelCard';
import { Modal } from './components/Modal';
import { AdminPanel } from './components/AdminPanel';
import { Hotel, LocationType } from './types';
import { getHotels } from './services/storageService';

const App: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationType>('哈尔滨');
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize date to local YYYY-MM-DD
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });

  // Load all hotels initially and when updates happen
  const loadData = useCallback(() => {
    const data = getHotels();
    setAllHotels(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter logic: If searching, search globally. If not, show current location.
  const displayedHotels = useMemo(() => {
    if (!searchQuery.trim()) {
      return allHotels.filter(h => h.location === currentLocation);
    }
    const lowerQuery = searchQuery.toLowerCase().trim();
    return allHotels.filter(h => 
      h.name.toLowerCase().includes(lowerQuery) || 
      h.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      h.location.includes(lowerQuery)
    );
  }, [searchQuery, currentLocation, allHotels]);

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  const handleBooking = () => {
    if (!selectedHotel) return;
    // Logic: Backend URL + Date (YYYY-MM-DD)
    const url = `${selectedHotel.bookingUrl}${bookingDate}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden font-sans">
      <Sidebar 
        currentLocation={currentLocation} 
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setSearchQuery(''); // Clear search when changing location manually
        }}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {isAdmin ? (
          <AdminPanel 
            currentLocation={currentLocation} 
            allHotels={allHotels}
            onLocationChange={setCurrentLocation}
            onUpdate={loadData}
          />
        ) : (
          <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
                  {searchQuery ? '搜索结果' : currentLocation} 
                  <span className="text-sm font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                    {displayedHotels.length} 家酒店
                  </span>
                </h2>
                <p className="text-gray-500 font-medium">
                  {searchQuery ? `找到包含 "${searchQuery}" 的相关酒店` : `探索${currentLocation}的最佳住宿体验`}
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative group w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                  placeholder="搜索酒店名称、标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Hotel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedHotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onClick={handleSelectHotel} 
                />
              ))}
            </div>

            {displayedHotels.length === 0 && (
              <div className="text-center py-24 animate-[fadeIn_0.5s_ease-out]">
                <div className="text-6xl mb-6 opacity-20">🔍</div>
                <h3 className="text-xl font-bold text-gray-400">
                  {searchQuery ? '未找到相关酒店' : '暂无酒店数据'}
                </h3>
                <p className="text-gray-300 mt-2">
                  {searchQuery ? '换个关键词试试看' : '请切换到后台管理模式添加数据'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-6 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    清除搜索
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedHotel} 
        onClose={() => setSelectedHotel(null)}
        title="酒店详情"
      >
        {selectedHotel && (
          <div className="flex flex-col">
            {/* Main Image - Compact height */}
            <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden shadow-sm bg-gray-100 relative group cursor-pointer mb-6">
               <img 
                src={selectedHotel.imageUrl} 
                alt={selectedHotel.name} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
            </div>

            {/* Header Info - Clean & Compact Layout */}
            <div className="px-1">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                  {selectedHotel.name}
                </h2>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm border border-green-100 shrink-0">
                    <span>{selectedHotel.rating}</span>
                    <span className="text-xs font-medium opacity-80">分</span>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 font-medium mb-6">
                <div className="flex items-center text-yellow-500">
                  {'★'.repeat(selectedHotel.stars)}
                  <span className="text-gray-400 ml-2">{selectedHotel.stars} 星级</span>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   {selectedHotel.location}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedHotel.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Booking Action Section */}
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-end gap-4 shadow-sm">
                <div className="w-full sm:flex-1 group">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    入住日期
                  </label>
                  <div className="relative bg-white rounded-xl ring-1 ring-gray-200 shadow-sm transition-all hover:ring-blue-400/50 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20 flex items-center overflow-hidden h-[52px]">
                     {/* Custom Icon */}
                    <div className="absolute left-4 text-gray-400 pointer-events-none z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full h-full bg-transparent pl-12 pr-4 text-gray-900 font-semibold text-base outline-none cursor-pointer placeholder-gray-400 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-0"
                    />
                    
                    {/* Right Arrow/Chevron */}
                     <div className="absolute right-4 text-gray-300 pointer-events-none">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleBooking}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 h-[52px] min-w-[140px]"
                >
                  立即预订
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;