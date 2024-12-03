import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Impor CSS Toastr
import Swal from 'sweetalert2'; // Impor SweetAlert2

const API_BASE_URL = 'http://localhost:5000'; // Ganti dengan URL backend Anda

const Admin2 = () => {
  const [tempatKemah, setTempatKemah] = useState([]);
  
  // State untuk menambah data
  const [nama, setNama] = useState('');
  const [gambar, setGambar] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [fasilitas, setFasilitas] = useState('');
  const [region, setRegion] = useState('');  // Tambahkan state untuk region
  
  // State untuk update data
  const [namaEdit, setNamaEdit] = useState('');
  const [gambarEdit, setGambarEdit] = useState('');
  const [deskripsiEdit, setDeskripsiEdit] = useState('');
  const [hargaEdit, setHargaEdit] = useState('');
  const [fasilitasEdit, setFasilitasEdit] = useState('');
  const [regionEdit, setRegionEdit] = useState('');  // Tambahkan state untuk region edit
  
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referensi form untuk scroll
  const formRef = useRef(null); // Ini untuk referensi ke form
  
  // Ambil data tempat kemah dari backend
  useEffect(() => {
    const fetchTempatKemah = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tempat_kemah`);
        setTempatKemah(response.data.data);
      } catch (err) {
        setError('Failed to fetch tempat kemah data');
      } finally {
        setLoading(false);
      }
    };

    fetchTempatKemah();
  }, []);

  // Fungsi untuk menambah tempat kemah
  const handleAddTempatKemah = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    if (!nama || !gambar || !deskripsi || !harga || !fasilitas || !region) {
      setError('Semua field harus diisi!');
      return;
    }

    Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menambahkan tempat kemah?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/tempat_kemah`, {
            nama,
            gambar,
            deskripsi,
            harga: parseFloat(harga), // Kirim harga sebagai angka
            fasilitas,
            region,  // Sertakan region di sini
          });

          fetchTempatKemah2();  // Panggil ulang fetchTempatKemah untuk mendapatkan data terbaru
          toastr.success('Tempat kemah berhasil ditambahkan!');  // Menampilkan notifikasi berhasil

          // Reset form setelah berhasil
          resetForm();
        } catch (err) {
          setError('Failed to add tempat kemah');
          console.error('Add error:', err);
          toastr.error('Gagal menambahkan tempat kemah.');  // Notifikasi gagal
        }
      }
    });
  };

  // Fungsi untuk mengedit tempat kemah
  const handleEditTempatKemah = (item) => {
    setEditId(item.id);
    setNamaEdit(item.nama);
    setGambarEdit(item.gambar);
    setDeskripsiEdit(item.deskripsi);
    setHargaEdit(item.harga); // Harga sebagai float
    setFasilitasEdit(item.fasilitas);
    setRegionEdit(item.region);  // Ambil region untuk edit

    // Scroll ke form update
    formRef.current.scrollIntoView({ behavior: 'smooth' });  // Scroll ke form ketika tombol update ditekan
  };

  const fetchTempatKemah2 = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/tempat_kemah`);
      setTempatKemah(response.data.data);
    } catch (err) {
      setError('Failed to fetch tempat kemah data');
    }finally {
        setLoading(false);  // Set loading false setelah fetch selesai
      }
  };

  // Fungsi untuk memperbarui tempat kemah
  const handleUpdateTempatKemah = async (e) => {
    e.preventDefault();
    if (!namaEdit || !gambarEdit || !deskripsiEdit || !hargaEdit || !fasilitasEdit || !regionEdit) {
      setError('Semua field harus diisi!');
      return;
    }

    Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin memperbarui tempat kemah?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${API_BASE_URL}/tempat_kemah/${editId}`, {
            nama: namaEdit,
            gambar: gambarEdit,
            deskripsi: deskripsiEdit,
            harga: parseFloat(hargaEdit), // Kirim harga sebagai angka
            fasilitas: fasilitasEdit,
            region: regionEdit,  // Sertakan region untuk update
          });
          setTempatKemah(
            tempatKemah.map((item) => (item.id === editId ? response.data.data : item))
          );
          fetchTempatKemah2();
          toastr.success('Tempat kemah berhasil diperbarui!');  // Menampilkan notifikasi berhasil
          resetForm();
        } catch (err) {
          setError('Failed to update tempat kemah');
          toastr.error('Gagal memperbarui tempat kemah.');  // Notifikasi gagal
        }
      }
    });
  };

  // Fungsi untuk menghapus tempat kemah
  const handleDeleteTempatKemah = async (id) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus tempat kemah ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/tempat_kemah/${id}`);
          setTempatKemah(tempatKemah.filter((item) => item.id !== id));
          toastr.success('Tempat kemah berhasil dihapus!');  // Notifikasi berhasil dihapus
        } catch (err) {
          setError('Failed to delete tempat kemah');
          toastr.error('Gagal menghapus tempat kemah.');  // Notifikasi gagal
        }
      }
    });
  };

  // Fungsi untuk memformat harga dengan "Rp" dan pemisah ribuan
  const formatHarga = (harga) => {
    return `Rp ${harga.toLocaleString('id-ID')}`;  // Format angka dengan pemisah ribuan untuk Indonesia
  };

  // Fungsi untuk menangani perubahan harga input
  const handleHargaChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ''); // Menghapus karakter selain angka
    if (value.length > 0) {
      // Format nilai angka yang dimasukkan dengan pemisah ribuan
      value = parseInt(value).toLocaleString('id-ID');
    }
    setHarga(value);  // Set harga sebagai string dengan format
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setNama('');
    setGambar('');
    setDeskripsi('');
    setHarga('');
    setFasilitas('');
    setRegion('');  // Reset region
    setNamaEdit('');
    setGambarEdit('');
    setDeskripsiEdit('');
    setHargaEdit('');
    setFasilitasEdit('');
    setRegionEdit('');  // Reset region edit
    setEditId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Admin - Manajemen Tempat Kemah</h1>
      
      <form
        ref={formRef}  // Tambahkan ref ke form
        onSubmit={editId ? handleUpdateTempatKemah : handleAddTempatKemah}
        className="bg-white p-6 rounded shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Nama Tempat Kemah"
          value={editId ? namaEdit : nama}
          onChange={(e) => (editId ? setNamaEdit(e.target.value) : setNama(e.target.value))}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Gambar URL"
          value={editId ? gambarEdit : gambar}
          onChange={(e) => (editId ? setGambarEdit(e.target.value) : setGambar(e.target.value))}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <textarea
          type="text"
          placeholder="Deskripsi"
          value={editId ? deskripsiEdit : deskripsi}
          onChange={(e) => (editId ? setDeskripsiEdit(e.target.value) : setDeskripsi(e.target.value))}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Harga"
          value={editId ? formatHarga(hargaEdit) : formatHarga(harga)}  // Tampilkan harga dengan format
          onChange={handleHargaChange}  // Fungsi untuk menangani perubahan input
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Fasilitas"
          value={editId ? fasilitasEdit : fasilitas}
          onChange={(e) => (editId ? setFasilitasEdit(e.target.value) : setFasilitas(e.target.value))}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Region"
          value={editId ? regionEdit : region}
          onChange={(e) => (editId ? setRegionEdit(e.target.value) : setRegion(e.target.value))}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editId ? 'Update' : 'Add'} Tempat Kemah
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full py-3 mt-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-2xl font-semibold mt-8">Daftar Tempat Kemah</h2>
      <ul className="space-y-6 mt-6">
        {tempatKemah.map((item) => (
          <li
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full flex flex-col md:flex-row"
          >
            <img
              src={item.gambar}
              alt={item.nama}
              className="w-full md:w-1/3 h-80 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-full w-full">
              <h3 className="text-lg font-bold text-gray-800">{item.nama}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {item.deskripsi}
              </p>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">
                  Harga: <span className="text-blue-600">{formatHarga(item.harga)}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Fasilitas: <span className="text-gray-600">{item.fasilitas}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Region: <span className="text-gray-600">{item.region}</span>
                </p>
              </div>
              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => handleEditTempatKemah(item)}
                  className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTempatKemah(item.id)}
                  className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>



    </div>
  );
};

export default Admin2;
