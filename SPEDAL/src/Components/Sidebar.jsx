import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // ikon hamburger & close

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = {
    admin: [
      { name: 'Beranda', path: '/Admin' },
      { name: 'Manajemen Pekerja', path: '/Admin/pekerja' },
      { name: 'Manajemen Admin', path: '/Admin/admin' },
      { name: 'Manajemen User', path: '/Admin/user' },
    ],
    pekerja: [
      { name: 'Beranda', path: '/Pekerja' },
      { name: 'Daftar Buku', path: '/Pekerja/tasks' },
      { name: 'Buat Pesanan', path: '/Pekerja/orders' },
      { name: 'Riwayat', path: '/Pekerja/history' },
    ],
    user: [
      { name: 'Beranda', path: '/Home' },
      { name: 'Daftar Buku', path: '/Home/books' },
      { name: 'Pesanan Saya', path: '/Home/orders' },
      { name: 'Bantuan', path: '/Home/help' },
    ],
  };

  return (
    <>
      {/* Tombol toggle sidebar (hanya muncul di layar kecil) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar untuk layar besar */}
      <div className="hidden md:flex w-64 h-screen bg-gray-800 text-white flex-col p-4">
        <h2 className="text-xl font-bold mb-6 capitalize">{role} Panel</h2>
        <ul className="space-y-4">
          {menuItems[role]?.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar slide-in untuk layar kecil */}
      {isOpen && (
        <div className="fixed inset-0  bg-opacity-40 z-40" onClick={() => setIsOpen(false)}>
          <div
            className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl text-center  font-bold mb-6 capitalize">{role} Panel</h2>
            <ul className="space-y-4">
              {menuItems[role]?.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="block px-3 py-2 rounded hover:bg-gray-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
