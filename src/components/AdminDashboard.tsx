import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppData, Neighborhood, Headquarter } from '../types';
import { LogOut, Save, Plus, Trash2, Edit2, X, Upload, MapPin } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);
  
  const [activeTab, setActiveTab] = useState<'neighborhoods' | 'headquarters'>('neighborhoods');
  const [editingNhId, setEditingNhId] = useState<string | null>(null);
  const [editNhForm, setEditNhForm] = useState<Neighborhood | null>(null);
  
  const [editingHqId, setEditingHqId] = useState<string | null>(null);
  const [editHqForm, setEditHqForm] = useState<Headquarter | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const handleSaveAll = async (updatedData: AppData) => {
    setIsSaving(true);
    try {
      await fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      setData(updatedData);
      setToast('Đã lưu dữ liệu thành công!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditNh = (item: Neighborhood) => {
    setEditingNhId(item.id);
    setEditNhForm({ ...item });
  };
  const cancelEditNh = () => {
    setEditingNhId(null);
    setEditNhForm(null);
  };
  const saveEditNh = () => {
    if (!editNhForm || !data) return;
    const newData = {
      ...data,
      neighborhoods: (data.neighborhoods || []).map(d => d.id === editNhForm.id ? editNhForm : d)
    };
    handleSaveAll(newData);
    cancelEditNh();
  };

  const startEditHq = (item: Headquarter) => {
    setEditingHqId(item.id);
    setEditHqForm({ ...item });
  };
  const cancelEditHq = () => {
    setEditingHqId(null);
    setEditHqForm(null);
  };
  const saveEditHq = () => {
    if (!editHqForm || !data) return;
    const newData = {
      ...data,
      headquarters: (data.headquarters || []).map(d => d.id === editHqForm.id ? editHqForm : d)
    };
    handleSaveAll(newData);
    cancelEditHq();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editHqForm) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditHqForm({ ...editHqForm, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!data) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Hệ thống Quản trị</h2>
          <p className="text-sm text-slate-500">Quản lý thông tin Phường Mỹ Ngãi</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {toast && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm font-medium border border-green-200 text-center animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('neighborhoods')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'neighborhoods' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          Quản lý Khu phố
        </button>
        <button 
          onClick={() => setActiveTab('headquarters')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'headquarters' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          Quản lý Trụ sở
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        {activeTab === 'neighborhoods' && (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Tên Khu phố / Tên cũ</th>
                <th className="p-4">Diện tích / Dân số</th>
                <th className="p-4">Trưởng KP / SĐT</th>
                <th className="p-4 w-1/4">Trụ sở</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(data.neighborhoods || []).map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  {editingNhId === row.id && editNhForm ? (
                    <td colSpan={5} className="p-4 bg-blue-50/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Tên Khu phố</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.newName} onChange={e => setEditNhForm({...editNhForm, newName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Tên cũ (cách nhau bởi phẩy)</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.oldNames.join(', ')} onChange={e => setEditNhForm({...editNhForm, oldNames: e.target.value.split(',').map(s=>s.trim())})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Diện tích (km²)</label>
                          <input type="number" step="0.01" className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.area} onChange={e => setEditNhForm({...editNhForm, area: parseFloat(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Số hộ / Nhân khẩu</label>
                          <div className="flex gap-2">
                            <input type="number" className="w-1/2 border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.households} onChange={e => setEditNhForm({...editNhForm, households: parseInt(e.target.value) || 0})} />
                            <input type="number" className="w-1/2 border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.population} onChange={e => setEditNhForm({...editNhForm, population: parseInt(e.target.value) || 0})} />
                          </div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-medium text-slate-600">Trưởng Khu phố & SĐT</label>
                          <div className="flex gap-2">
                            <input className="w-1/2 border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.leader} onChange={e => setEditNhForm({...editNhForm, leader: e.target.value})} placeholder="Tên" />
                            <input className="w-1/2 border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.phone} onChange={e => setEditNhForm({...editNhForm, phone: e.target.value})} placeholder="SĐT" />
                          </div>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-medium text-slate-600">Địa chỉ Trụ sở</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editNhForm.address} onChange={e => setEditNhForm({...editNhForm, address: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEditNh} className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm font-medium">Hủy</button>
                        <button onClick={saveEditNh} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                          <Save className="w-4 h-4" /> Lưu
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{row.newName}</div>
                        <div className="text-xs text-slate-500">{row.oldNames.join(', ')}</div>
                      </td>
                      <td className="p-4">
                        <div>{row.area} km²</div>
                        <div className="text-xs text-slate-500">{row.households} hộ / {row.population} khẩu</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{row.leader}</div>
                        <div className="text-xs text-slate-500">{row.phone}</div>
                      </td>
                      <td className="p-4 text-slate-600 text-xs">
                        {row.address}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => startEditNh(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'headquarters' && (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Logo</th>
                <th className="p-4">Tên Trụ sở</th>
                <th className="p-4">Địa chỉ / Maps</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(data.headquarters || []).map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  {editingHqId === row.id && editHqForm ? (
                    <td colSpan={4} className="p-4 bg-blue-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Tên Trụ sở</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editHqForm.name} onChange={e => setEditHqForm({...editHqForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-600">Link Google Maps</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editHqForm.mapUrl} onChange={e => setEditHqForm({...editHqForm, mapUrl: e.target.value})} placeholder="https://maps.google.com/..." />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-medium text-slate-600">Địa chỉ cụ thể</label>
                          <input className="w-full border rounded p-2 text-sm outline-none focus:border-blue-500 bg-white" value={editHqForm.address} onChange={e => setEditHqForm({...editHqForm, address: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-medium text-slate-600 block">Logo / Biểu tượng</label>
                          <div className="flex items-center gap-4">
                            {editHqForm.logoUrl ? (
                              <img src={editHqForm.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded border bg-white" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-100 rounded border flex items-center justify-center text-slate-400">
                                <MapPin className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                              <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <Upload className="w-4 h-4" /> Tải ảnh lên
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEditHq} className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm font-medium">Hủy</button>
                        <button onClick={saveEditHq} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                          <Save className="w-4 h-4" /> Lưu
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="p-4">
                        {row.logoUrl ? (
                          <img src={row.logoUrl} alt={row.name} className="w-10 h-10 rounded object-contain border bg-white shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{row.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{row.address}</div>
                        {row.mapUrl && <a href={row.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Xem bản đồ</a>}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => startEditHq(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
