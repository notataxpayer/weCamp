import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import CSS SweetAlert2

const Navbar = () => {
  const [activePage, setActivePage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Mengambil nilai halaman aktif dari localStorage atau default berdasarkan URL
  useEffect(() => {
    const savedActivePage = localStorage.getItem('activePage') || 'dashboard';
    if (location.pathname === '/login' || location.pathname === '/admin') {
      setActivePage('');
    } else {
      setActivePage(savedActivePage);
    }
  }, [location.pathname]);

  // Fungsi untuk mengubah halaman aktif dan menyimpannya di localStorage
  const handleSetActivePage = (page) => {
    setActivePage(page);
    localStorage.setItem('activePage', page);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Anda berhasil logout!');
        localStorage.removeItem('activePage');
        setActivePage('');
        navigate('/login');
      }
    });
  };

  // Cek apakah saat ini berada di halaman login atau admin
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname === '/admin';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        <div className="text-2xl font-bold">WeCamp</div>
        <div className="space-x-6">
          {/* Jika di halaman admin, hanya tampilkan opsi Update */}
          {isAdminPage ? (
            <Link
              // to="/login"
              onClick={() => handleLogout('logout')}
              className={`${
                activePage === 'admin' ? 'text-blue-500' : 'text-gray-300'
              } hover:text-blue-400`}
            >
              logout
            </Link>
          ) : (
            <>
              {/* Link ke Dashboard, hanya tampilkan jika bukan di halaman login atau admin */}
              {!isLoginPage && !isAdminPage && (
                <Link
                  to="/dashboard"
                  onClick={() => handleSetActivePage('dashboard')}
                  className={`${
                    activePage === 'dashboard' ? 'text-blue-500' : 'text-gray-300'
                  } hover:text-blue-400`}
                >
                  Dashboard
                </Link>
              )}

              {/* Link ke Booking, hanya tampilkan jika bukan di halaman login atau admin */}
              {!isLoginPage && !isAdminPage && (
                <Link
                  to="/booking"
                  onClick={() => handleSetActivePage('booking')}
                  className={`${
                    activePage === 'booking' ? 'text-blue-500' : 'text-gray-300'
                  } hover:text-blue-400`}
                >
                  Booking
                </Link>
              )}

              {/* Tombol Logout, hanya tampilkan jika bukan di halaman login atau admin */}
              {!isLoginPage && !isAdminPage && (
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-blue-400"
                >
                  Logout
                </button>
              )}
            </>
          )}
        </div>
        <ToastContainer />
      </div>
    </nav>
  );
};

export default Navbar;
