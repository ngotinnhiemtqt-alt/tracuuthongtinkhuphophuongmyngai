import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Users, Home as HomeIcon, Download, Info } from 'lucide-react';
import type { AppData, Neighborhood, Headquarter } from '../types';
import { cn } from '../lib/utils';

export function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Neighborhood | null>(null);
  const [selectedHq, setSelectedHq] = useState<Headquarter | null>(null);

  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const filtered = data?.neighborhoods.filter(n => {
    const q = search.toLowerCase();
    return n.newName.toLowerCase().includes(q) || 
           n.oldNames.some(old => old.toLowerCase().includes(q));
  }) || [];

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Tra cứu thông tin Khu phố</h2>
        <p className="text-slate-600 text-lg">Tìm kiếm nhanh thông tin tổ chức hành chính, liên hệ và địa giới của 12 khu phố trên địa bàn Phường Mỹ Ngãi sau khi sắp xếp lại.</p>
        
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => {
              document.getElementById('neighborhood-list')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2"
          >
            Hiện Danh sách 12 Khu phố
          </button>
        </div>

        <div className="relative max-w-xl mx-auto mt-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg border outline-none bg-white transition-shadow hover:shadow-md"
            placeholder="Nhập tên khu phố hoặc tên khóm cũ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Info graphics */}
      <section className="grid md:grid-cols-2 gap-8 print:hidden">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4 text-slate-800 text-center">Bản đồ Hành chính Phường Mỹ Ngãi</h3>
          <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 p-2 relative">
             <img src="/map.jpg" alt="Bản đồ Hành chính Phường Mỹ Ngãi" className="w-full h-auto object-contain rounded-lg" />
             {data?.neighborhoods.map(nh => (
               nh.mapX !== undefined && nh.mapY !== undefined ? (
                 <button
                   key={nh.id}
                   onClick={() => setSelected(nh)}
                   className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col group z-10"
                   style={{ left: `${nh.mapX}%`, top: `${nh.mapY}%` }}
                 >
                   <div className="bg-red-500/90 text-white rounded-full p-1.5 shadow-md group-hover:bg-red-600 group-hover:scale-110 transition-all cursor-pointer">
                     <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                   </div>
                   <span className="bg-white/95 text-slate-800 text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-sm font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     {nh.newName}
                   </span>
                 </button>
               ) : null
             ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4 text-slate-800 text-center">Infographic Sắp xếp Khu phố</h3>
          <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 p-2">
             <img src="/infographic.jpg" alt="Infographic Sắp xếp Khu phố" className="w-full h-auto object-contain rounded-lg" />
          </div>
        </div>
      </section>

      <section className="space-y-4 print:hidden">
        <h3 className="text-xl font-bold text-slate-800 text-center">Các Trụ sở trên địa bàn</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {data?.headquarters?.map(hq => (
            <button 
              key={hq.id} 
              onClick={() => setSelectedHq(hq)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-sm font-medium text-slate-700"
            >
              {hq.logoUrl ? (
                <img src={hq.logoUrl} alt={hq.name} className="w-5 h-5 rounded-full object-contain" />
              ) : (
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              )}
              {hq.name}
            </button>
          ))}
        </div>
      </section>

      <div id="neighborhood-list" className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-slate-800">Danh sách Khu phố ({filtered.length})</h3>
        <button 
          onClick={exportPDF}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Xuất Báo Cáo PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {filtered.map(nh => (
          <div 
            key={nh.id} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer print:break-inside-avoid print:shadow-none print:border-slate-300"
            onClick={() => setSelected(nh)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-blue-800">{nh.newName}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {nh.oldNames.map(old => (
                    <span key={old} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                      {old} cũ
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <div>
                  <span className="font-medium text-slate-900">{nh.leader}</span> (Trưởng khu phố)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <span>{nh.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <span className="line-clamp-2">{nh.address}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            Không tìm thấy thông tin khu phố hoặc khóm phù hợp.
          </div>
        )}
      </div>

      {/* Modal View for detailed info */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white relative">
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold">{selected.newName}</h3>
              <p className="text-blue-100 mt-1">
                Gồm: {selected.oldNames.join(', ')} cũ
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Diện tích</div>
                  <div className="font-bold text-slate-900">{selected.area} <span className="text-xs font-normal">km²</span></div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Số Hộ</div>
                  <div className="font-bold text-slate-900">{selected.households.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Nhân Khẩu</div>
                  <div className="font-bold text-slate-900">{selected.population.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 border-b pb-2">Thông tin Liên hệ</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Users className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{selected.leader}</div>
                      <div className="text-xs text-slate-500">Trưởng khu phố</div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                    <a href={`tel:${selected.phone}`} className="text-sm font-medium text-blue-600 hover:underline">{selected.phone}</a>
                  </div>
                  <div className="flex gap-3 items-start">
                    <HomeIcon className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="text-sm text-slate-700 leading-snug">{selected.address}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => setSelected(null)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View for Headquarters */}
      {selectedHq && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden" onClick={() => setSelectedHq(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex flex-col items-center text-center">
              {selectedHq.logoUrl ? (
                <img src={selectedHq.logoUrl} alt={selectedHq.name} className="w-20 h-20 rounded-full object-contain mb-4 border-2 border-blue-100 shadow-sm bg-white" />
              ) : (
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-10 h-10" />
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedHq.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{selectedHq.address}</p>
              
              {selectedHq.mapUrl ? (
                <a href={selectedHq.mapUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                  <MapPin className="w-4 h-4" /> Mở trên Google Maps
                </a>
              ) : null}
            </div>
            <div className="p-4 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedHq(null)}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors w-full"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
