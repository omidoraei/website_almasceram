import React, { useState } from 'react';
import { Product } from '../types/tile';
import { X, Layers, Home, Maximize, RefreshCw } from 'lucide-react';

interface RoomVisualizerProps {
  products: Product[];
  onClose: () => void;
}

const ROOM_TYPES = [
  {
    id: 'living',
    name: 'سالن پذیرایی لوکس',
    bg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'bathroom',
    name: 'حمام و سرویس مستر',
    bg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lobby',
    name: 'لابی مجتمع تجاری/اداری',
    bg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'facade',
    name: 'نما و دیواره خارجی',
    bg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
  }
];

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ products, onClose }) => {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white">شبیه‌ساز چیدمان آنلاین کاشی و سرامیک الماس سرام</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid md:grid-cols-12 gap-6">
            
            {/* Visualizer Stage */}
            <div className="md:col-span-8 space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <img
                  src={selectedRoom.bg}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Tile Pattern Effect */}
                {selectedProduct && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                    style={{
                      backgroundImage: `url(${selectedProduct.image_url})`,
                      backgroundSize: selectedProduct.size === '60x120' ? '240px 120px' : '160px 160px',
                      backgroundRepeat: 'repeat'
                    }}
                  />
                )}

                {/* Active Tile Tag */}
                <div className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-amber-500/30 text-xs">
                  <div className="text-amber-400 font-bold">{selectedProduct?.title_fa || 'کاشی انتخاب نشده'}</div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    سایز: {selectedProduct?.size} | سطح: {selectedProduct?.surface_finish}
                  </div>
                </div>
              </div>

              {/* Room Selector Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border whitespace-nowrap transition-all ${
                      selectedRoom.id === room.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tile Selection Column */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-amber-300">انتخاب کاشی جهت تست چیدمان:</h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                      selectedProduct?.id === p.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <img src={p.image_url} alt={p.title_fa} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs line-clamp-1">{p.title_fa}</div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        {p.size} cm | {p.surface_finish}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
