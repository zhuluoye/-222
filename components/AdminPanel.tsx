import React, { useState, useEffect } from 'react';
import { Hotel, LOCATIONS, LocationType } from '../types';
import { addHotel, updateHotel, deleteHotel } from '../services/storageService';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface AdminPanelProps {
  currentLocation: LocationType;
  allHotels: Hotel[];
  onLocationChange: (loc: LocationType) => void;
  onUpdate: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentLocation, 
  allHotels, 
  onLocationChange,
  onUpdate 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({
    location: currentLocation,
    tags: [],
    stars: 5,
    rating: 5.0
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync form location when category changes
  useEffect(() => {
    if (!editingId) {
      setFormData(prev => ({ ...prev, location: currentLocation }));
    }
  }, [currentLocation, editingId]);

  // Filter hotels for the current view
  const currentHotels = allHotels.filter(h => h.location === currentLocation);

  const handleEdit = (hotel: Hotel) => {
    setEditingId(hotel.id);
    setFormData({ ...hotel });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      location: currentLocation,
      name: '',
      stars: 5,
      rating: 5.0,
      tags: [],
      description: '',
      imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
      bookingUrl: '#'
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个酒店吗？')) {
      deleteHotel(id);
      onUpdate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    const hotelData = {
      ...formData,
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t:string) => t.trim()) : formData.tags,
      imageUrl: formData.imageUrl?.trim() || '', // Trim whitespace from URL
      rating: Number(formData.rating),
      stars: Number(formData.stars)
    } as Hotel;

    if (editingId) {
      updateHotel(hotelData);
    } else {
      addHotel({ ...hotelData, id: generateId() });
    }

    setIsFormOpen(false);
    onUpdate();
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-gray-800 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">后台管理</h2>
          <p className="text-gray-500 mt-1 font-medium">酒店分类与数据维护</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew}
            className="bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 font-bold text-sm"
          >
            <span>+</span> 新增酒店
          </button>
        )}
      </div>

      {/* Category Tabs (Segmented Control style) */}
      {!isFormOpen && (
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-max min-w-full md:min-w-0">
            {LOCATIONS.map((loc) => {
              const count = allHotels.filter(h => h.location === loc).length;
              const isActive = currentLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => onLocationChange(loc)}
                  className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                    ${isActive 
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }`}
                >
                  {loc}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] 
                    ${isActive ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {isFormOpen ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-[fadeIn_0.3s_ease-out] max-w-4xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">{editingId ? '编辑酒店' : '新增酒店'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>酒店名称</label>
                  <input 
                    type="text" 
                    required
                    className={inputClass}
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="输入酒店名称"
                  />
                </div>
                <div>
                  <label className={labelClass}>所属地区</label>
                  <select 
                    className={inputClass}
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value as LocationType})}
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelClass}>星级 (1-5)</label>
                  <input 
                    type="number" min="1" max="5"
                    className={inputClass}
                    value={formData.stars || 5}
                    onChange={e => setFormData({...formData, stars: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className={labelClass}>评分 (0-5.0)</label>
                  <input 
                    type="number" step="0.1" min="0" max="5"
                    className={inputClass}
                    value={formData.rating || 5.0}
                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  />
                </div>
                <div className="col-span-2">
                   <label className={labelClass}>标签 (逗号分隔)</label>
                   <input 
                    type="text" 
                    className={inputClass}
                    placeholder="如: 滑雪, 亲子, 温泉"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>图片链接</label>
                <input 
                  type="text" 
                  className={inputClass}
                  placeholder="https://..."
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
              
              <div>
                <label className={labelClass}>预订链接</label>
                <input 
                  type="text" 
                  className={inputClass}
                  placeholder="https://..."
                  value={formData.bookingUrl || ''}
                  onChange={e => setFormData({...formData, bookingUrl: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>描述 (备用)</label>
                <textarea 
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="酒店描述信息..."
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition font-medium"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all font-medium"
                >
                  保存更改
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden h-full flex flex-col">
             <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 backdrop-blur sticky top-0 z-10">
                  <tr>
                    <th className="p-5 pl-8 font-semibold text-gray-500 text-xs uppercase tracking-wider">酒店名称</th>
                    <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">星级</th>
                    <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">评分</th>
                    <th className="p-5 pr-8 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentHotels.map(hotel => (
                    <tr key={hotel.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                            <img 
                              src={hotel.imageUrl} 
                              alt={hotel.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.onerror = null;
                                 target.src = 'https://placehold.co/100x100?text=No+Img';
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-gray-900 font-bold">{hotel.name}</div>
                            <div className="text-gray-400 text-xs mt-0.5">{hotel.tags.slice(0, 2).join(', ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center text-yellow-400 text-xs">
                          {'★'.repeat(hotel.stars)}
                          <span className="text-gray-300 ml-1">({hotel.stars})</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-100">
                          {hotel.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(hotel)}
                            className="text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={() => handleDelete(hotel.id)}
                            className="text-gray-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition text-sm font-semibold"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentHotels.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">📂</div>
                        <p className="text-gray-400 font-medium">该分类下暂无酒店数据</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};