import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home } from './components/Home';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { MessageSquare, LayoutDashboard } from 'lucide-react';
import { ChatWidget } from './components/ChatWidget';

function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-blue-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-full text-blue-700 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base lg:text-lg leading-tight uppercase">
                TRA CỨU THÔNG TIN CÁC KHU PHỐ TRÊN ĐỊA BÀN PHƯỜNG MỸ NGÃI, TỈNH ĐỒNG THÁP
              </h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/admin/login" className="text-sm font-medium hover:text-blue-200 transition-colors hidden sm:block">
              Quản trị viên
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-700 mb-1">Bản quyền thuộc về Trung tâm Cung ứng dịch vụ công phường Mỹ Ngãi</p>
          <p>Được tạo bởi Ngô Tín Nhiệm</p>
        </div>
      </footer>
      
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
