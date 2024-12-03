import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';


const API_BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
    const [allData, setAllData] = useState([]); // Semua data tempat kemah
    const [filteredData, setFilteredData] = useState([]); // Data setelah difilter
    const [searchQuery, setSearchQuery] = useState(''); // Input pencarian
    const [initialData, setInitialData] = useState([]); // Data untuk tampilan awal (random)
    const [searching, setSearching] = useState(false); // Menandakan apakah pencarian sudah dilakukan
    const [selectedSite, setSelectedSite] = useState(null); // Tempat kemah yang dipilih
    const [showBookingForm, setShowBookingForm] = useState(false); // Menampilkan form pemesanan

    const [bookingDetails, setBookingDetails] = useState({
        arrivalDate: '',
        numberOfDays: 1,
        numberOfPeople: 1,
        totalPrice: 0,
    });

    const formatHarga = (harga) => {
        return `Rp ${harga.toLocaleString('id-ID')}`;  // Format angka dengan pemisah ribuan untuk Indonesia
    };

    // Ambil semua data ketika komponen pertama kali dimuat
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/tempat_kemah`);
                if (response.data.success) {
                    setAllData(response.data.data);
                    setFilteredData(response.data.data); // Set data awal sebagai data yang difilter

                    // Menampilkan 3 tempat kemah secara acak untuk tampilan awal
                    const randomPlaces = response.data.data.sort(() => 0.5 - Math.random()).slice(0, 3);
                    setInitialData(randomPlaces);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk memfilter data berdasarkan pencarian
    const handleSearch = () => {
        const filtered = allData.filter(item =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.region.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered); // Set data yang difilter
        setSearching(true); // Menandakan pencarian telah dilakukan
    };

    // Fungsi untuk membatalkan pencarian
    const cancelSearch = () => {
        setSearchQuery('');
        setFilteredData(allData); // Kembalikan ke data awal
        setSearching(false); 
    };

    // Menutup modal detail dan form booking
    const closeModal = () => {
        setSelectedSite(null);
        setShowBookingForm(false);
    };

    // Fungsi untuk memilih tempat kemah dan menampilkan modal detail
    const showSiteDetails = (site) => {
        setSelectedSite(site);
        setShowBookingForm(false);
    };

    // Handle pemesanan
    const handleBooking = () => {
        alert('Booking berhasil!');
        resetFormBooking(); // Reset form setelah booking berhasil
    };

    // Kosongkan form
    const resetFormBooking = () => {
        setBookingDetails({
            arrivalDate: '',
            numberOfDays: 1,
            numberOfPeople: 1,
            totalPrice: 0,
        });
        closeModal();
        setShowBookingForm(false);
    };

    // Handle input formulir pemesanan
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Ambil harga per malam langsung dari selectedSite.harga
        const pricePerNight = selectedSite ? selectedSite.harga : 0;
    
        // Update booking details sesuai dengan perubahan input
        const newBookingDetails = {
            ...bookingDetails,
            [name]: value,
        };
    
        // Hitung total harga
        const totalPrice = pricePerNight * newBookingDetails.numberOfDays * newBookingDetails.numberOfPeople;
    
        // Update state dengan total harga yang baru
        setBookingDetails({
            ...newBookingDetails,
            totalPrice, 
        });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Dashboard Tempat Kemah</h1>
            <div className="mb-6 flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari lokasi kemah (nama atau region)"
                    className="border border-gray-300 p-2 rounded-lg mr-2 w-full"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 rounded-lg"
                >
                    Cari
                </button>
                {searching && (
                    <button
                        onClick={cancelSearch}
                        className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                        <i className="fa fa-times text-black text-xl"></i> 
                    </button>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Tempat Kemah Pilihan</h2>
                <div className="flex flex-col pb-4">
                    {/* Jika searching aktif, gunakan filteredData, jika tidak gunakan initialData */}
                    {(searching ? filteredData : initialData).map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg md:p-4 p-6 mb-2 w-full flex-shrink-0">
                            <img
                                src={item.gambar}
                                alt={item.nama}
                                className="w-full md:w-1/2 h-48 object-cover rounded-lg"
                            />
                            <h3 className="text-xl font-semibold mt-4">{item.nama}</h3>
                            <p className="text-sm text-gray-500">{item.region}</p>
                            <p className="mt-2">{item.deskripsi}</p>
                            <p className="mt-4 font-bold">{formatHarga(item.harga)}</p>
                            <button
                                onClick={() => showSiteDetails(item)}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                                Lihat Detail
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Detail Tempat Kemah */}
            {selectedSite && !showBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6 pr-0 relative overflow-y-auto max-h-screen">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>
                        <img
                            src={selectedSite.gambar}
                            alt={selectedSite.nama}
                            className="w-11/12 h-64 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-800">{selectedSite.nama}</h3>
                        <p className="text-sm text-gray-600 mt-2">{selectedSite.deskripsi}</p>
                        <div className="mt-4 text-lg font-semibold text-blue-600">
                        {formatHarga(selectedSite.harga)}
                        </div>
                        <p className="text-gray-700 mt-4">Fasilitas: {selectedSite.fasilitas}</p>
                        <div className="mt-6 flex w-11/12 flex-col gap-4">
                            <button
                                onClick={() => setShowBookingForm(true)}
                                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Booking */}
            {showBookingForm && selectedSite && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6 relative max-h-screen">
                        <button
                            onClick={resetFormBooking}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>
                        <h3 className="text-2xl font-bold text-gray-800">Formulir Pemesanan</h3>

                        {/* Tanggal Kedatangan */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600">Tanggal Kedatangan</label>
                            <input
                                type="date"
                                name="arrivalDate"
                                value={bookingDetails.arrivalDate}
                                onChange={handleInputChange}
                                min={getTodayDate()} // Set minimal tanggal hari ini
                                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Jumlah Hari */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600">Jumlah Hari</label>
                            <input
                                type="number"
                                name="numberOfDays"
                                value={bookingDetails.numberOfDays}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Jumlah Orang */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600">Jumlah Orang</label>
                            <input
                                type="number"
                                name="numberOfPeople"
                                value={bookingDetails.numberOfPeople}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Total Harga */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600">Total Harga</label>
                            <input
                                type="text"
                                value={`Rp ${bookingDetails.totalPrice.toLocaleString('id-ID')}`} // Format angka dengan pemisah ribuan
                                disabled
                                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-200"
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleBooking}
                                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                            >
                                Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
