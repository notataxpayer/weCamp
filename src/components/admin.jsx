import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS untuk styling toast

const AdminDashboard = () => {
  const [campSites, setCampSites] = useState({
    Bali: [
      {
        name: 'Taman Nasional Bali Barat',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029182/APS/aaa_h1jcr1.jpg',
        description: 'Tempat yang indah dengan pemandangan alam yang mempesona.',
        price: 'Rp 500.000 / malam',
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Tempat Parkir', 'Area Api Unggun', 'Penginapan'],
        reviews: [],
      },
      {
        name: 'Kemah Karangasem',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029359/APS/karangasem_zqa56j.jpg',
        description: 'Desa dengan suasana alami dan arsitektur tradisional Bali.',
        price: 'Rp 300.000 / malam',
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Area Berkebun', 'Parkir', 'Penginapan'],
        reviews: [],
      },
    ],
    Yogyakarta: [
      {
        name: 'Gunung Merapi',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732028725/APS/ada_smnkbp.jpg',
        description: 'Gunung aktif yang menawarkan pengalaman mendaki yang menantang.',
        price: 'Rp 400.000 / malam',
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Area Camping', 'Pos Penjagaan', 'Penginapan'],
        reviews: [],
      },
      {
        name: 'Pantai Parangtritis',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029408/APS/jogja_tyr6bv.jpg',
        description: 'Pantai dengan pemandangan sunset yang menakjubkan.',
        price: 'Rp 200.000 / malam',
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Tempat Parkir', 'Kawasan Wisata', 'Penginapan'],
        reviews: [],
      },
    ],
  });

  const [selectedLocation, setSelectedLocation] = useState('Bali');
  const [newCamp, setNewCamp] = useState({
    name: '',
    imgUrl: '',
    description: '',
    price: '',
    availability: 'Tersedia',
    facilities: '',
  });

  const [editIndex, setEditIndex] = useState(null); // Untuk menyimpan index destinasi yang sedang diedit

  const handleAddCamp = () => {
    if (newCamp.name) {
      const facilitiesArray = newCamp.facilities.split(',').map(facility => facility.trim());
      const newCampWithFacilities = { ...newCamp, facilities: facilitiesArray };

      if (editIndex !== null) {
        // Update destinasi yang sedang diedit
        setCampSites((prev) => {
          const updatedCamps = [...prev[selectedLocation]];
          updatedCamps[editIndex] = newCampWithFacilities; // Update destinasi berdasarkan index
          return { ...prev, [selectedLocation]: updatedCamps };
        });
        toast.success('Destinasi berhasil diperbarui!');
      } else {
        // Menambahkan destinasi baru
        setCampSites((prev) => ({
          ...prev,
          [selectedLocation]: [...prev[selectedLocation], newCampWithFacilities],
        }));
        toast.success('Destinasi berhasil ditambahkan!');
      }
      setNewCamp({
        name: '',
        imgUrl: '',
        description: '',
        price: '',
        availability: 'Tersedia',
        facilities: '',
      });
      setEditIndex(null); // Reset editIndex setelah selesai
    } else {
      toast.error('Nama destinasi wajib diisi!');
    }
  };

  const handleDeleteCamp = (index) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
      setCampSites((prev) => ({
        ...prev,
        [selectedLocation]: prev[selectedLocation].filter((_, i) => i !== index),
      }));
      toast.success('Destinasi berhasil dihapus!');
    }
  };

  const handleEditCamp = (index) => {
    const camp = campSites[selectedLocation][index];
    setNewCamp({
      ...camp, // Menyalin semua properti destinasi yang dipilih
      facilities: camp.facilities.join(', '), // Mengubah array fasilitas menjadi string yang dipisahkan koma
    });
    setEditIndex(index); // Menyimpan index destinasi yang sedang diedit
  };

  const handleToggleAvailability = (index) => {
    if (window.confirm('Apakah Anda yakin ingin mengubah status ketersediaan?')) {
      setCampSites((prev) => {
        const updatedCamps = [...prev[selectedLocation]];
        const currentCamp = updatedCamps[index];
        updatedCamps[index] = {
          ...currentCamp,
          availability: currentCamp.availability === 'Tersedia' ? 'Tutup' : 'Tersedia',
        };
        return { ...prev, [selectedLocation]: updatedCamps };
      });
      toast.success('Status ketersediaan berhasil diperbarui!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Kelola Destinasi</h2>
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {Object.keys(campSites).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Daftar Camp Sites */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campSites[selectedLocation].map((camp, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={camp.imgUrl}
                alt={camp.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{camp.name}</h3>
                <p className="text-gray-700 text-sm mb-4">{camp.description}</p>
                <p className="text-gray-500 text-sm">Harga: {camp.price}</p>
                <p className="text-sm text-gray-500 mt-2"><strong>Fasilitas:</strong></p>
                <ul className="text-sm text-gray-600">
                  {camp.facilities.map((facility, i) => (
                    <li key={i}>{facility}</li>
                  ))}
                </ul>
                <p className={`mt-2 text-sm font-semibold ${camp.availability === 'Tersedia' ? 'text-green-600' : 'text-red-600'}`}>
                  {camp.availability}
                </p>
                <div className="flex gap-4 items-center mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteCamp(index)}
                  >
                    Hapus
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleEditCamp(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    onClick={() => handleToggleAvailability(index)}
                  >
                    {camp.availability === 'Tersedia' ? 'Tutup' : 'Tersedia'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Tambah/Edit Destinasi */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{editIndex !== null ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Destinasi
              </label>
              <input
                type="text"
                placeholder="Nama Destinasi"
                className="mt-1 px-4 py-2 w-full border rounded-md"
                value={newCamp.name}
                onChange={(e) =>
                  setNewCamp({ ...newCamp, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gambar URL
              </label>
              <input
                type="text"
                placeholder="URL Gambar"
                className="mt-1 px-4 py-2 w-full border rounded-md"
                value={newCamp.imgUrl}
                onChange={(e) =>
                  setNewCamp({ ...newCamp, imgUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                placeholder="Deskripsi"
                className="mt-1 px-4 py-2 w-full border rounded-md"
                value={newCamp.description}
                onChange={(e) =>
                  setNewCamp({ ...newCamp, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Harga
              </label>
              <input
                type="text"
                placeholder="Harga"
                className="mt-1 px-4 py-2 w-full border rounded-md"
                value={newCamp.price}
                onChange={(e) =>
                  setNewCamp({ ...newCamp, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fasilitas (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Fasilitas"
                className="mt-1 px-4 py-2 w-full border rounded-md"
                value={newCamp.facilities}
                onChange={(e) =>
                  setNewCamp({ ...newCamp, facilities: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              onClick={handleAddCamp}
            >
              {editIndex !== null ? 'Simpan Perubahan' : 'Tambah Destinasi'}
            </button>
          </form>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
