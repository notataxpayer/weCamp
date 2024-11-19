import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false); // New state for form visibility
  const [bookingDetails, setBookingDetails] = useState({
    arrivalDate: '',
    numberOfDays: 0,
    numberOfPeople: 0,
    totalPrice: 0
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [photo, setPhoto] = useState(null);

  const campSites = {
    Bali: [
      {
        name: 'Taman Nasional Bali Barat',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029182/APS/aaa_h1jcr1.jpg',
        description: 'Tempat yang indah dengan pemandangan alam yang mempesona.',
        price: 50000, // changed to number for calculation
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Tempat Parkir', 'Area Api Unggun', 'Penginapan'],
        reviews: [
          { user: 'John', rating: 5, comment: 'Tempat yang luar biasa! Pemandangannya indah.',img:'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732028700/APS/aaa_ogg8s6.jpg' },
          { user: 'Sara', rating: 4, comment: 'Suasananya tenang, cocok untuk relaksasi.' , img: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732028725/APS/ada_smnkbp.jpg'}
        ]
      },
      {
        name: 'Gunung Rinjani',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732028725/APS/ada_smnkbp.jpg',
        description: 'Gunung yang cocok untuk para petualang yang suka hiking.',
        price: 75000,
        availability: 'Tersedia',
        facilities: ['Area Camping', 'Jalur Pendakian', 'Toilet Umum'],
        reviews: [
          { user: 'Alex', rating: 5, comment: 'Pendakian yang menantang, pemandangan luar biasa.' },
          { user: 'Linda', rating: 3, comment: 'Fasilitas pendakian perlu perbaikan.' }
        ]
      },
      {
        name: 'Kampung Suku Bali Aga',
        imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029240/APS/abb_f0rfvi.jpg',
        description: 'Pengalaman budaya Bali yang asli dan dekat dengan alam.',
        price: 40000,
        availability: 'Tersedia',
        facilities: ['Toilet Umum', 'Tempat Parkir', 'Warung Makan', 'Area Camping'],
        reviews: [
          { user: 'Rina', rating: 4, comment: 'Pengalaman budaya yang sangat menarik!' },
          { user: 'Eka', rating: 5, comment: 'Suasananya sangat damai dan alami.' }
        ]
      }
    ],
    // Add other locations here
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      toast.success("Review anda berhasil terkirim"); // Menampilkan toast sukses
      setReviewText(""); // Reset form setelah pengiriman
      setPhoto(null);
      setShowReviewForm(false); // Menutup form setelah sukses
    }, 1000);
  };
  useEffect(() => {
    const processRecommendations = () => {
      const trendingSites = Object.keys(campSites).flatMap((location) => {
        return campSites[location].map((site) => ({
          ...site,
          location,
          averageRating: site.reviews.reduce((acc, review) => acc + review.rating, 0) / site.reviews.length
        }));
      });

      // Mengurutkan tempat kemah berdasarkan rating tertinggi
      trendingSites.sort((a, b) => b.averageRating - a.averageRating);
      setRecommendations(trendingSites);
    };

    processRecommendations();
  }, []);

  const handleSearch = () => {
    const filteredRecommendations = location ? 
      campSites[location.charAt(0).toUpperCase() + location.slice(1).toLowerCase()] || [] : [];
    if (filteredRecommendations.length === 0 && location !== '') {
      setErrorMessage('Maaf, tempat perkemahan tidak ditemukan.');
    } else {
      setErrorMessage('');
      setRecommendations(filteredRecommendations);
    }
  };

  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setShowBookingForm(false); // Hide the booking form initially
  };

  const closeModal = () => {
    setSelectedSite(null);
    setShowBookingForm(false); // Hide form when modal is closed
  };

  const handleBooking = () => {
    toast.success("Booking berhasil!");
    setSelectedSite(null);
    setShowBookingForm(false); // Reset form visibility after booking
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevState) => {
      const newBookingDetails = {
        ...prevState,
        [name]: value
      };
      newBookingDetails.totalPrice =
      newBookingDetails.numberOfDays * newBookingDetails.numberOfPeople * selectedSite.price;
      return newBookingDetails;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-lg">
        <h2 className="text-2xl font-semibold text-start mb-12 text-gray-800">
          Selamat datang, <br /> <p className="text-3xl font-bold">Dymimimi</p>
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="location">
            Cari lokasi kemah
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Bali, Bogor, Bandung"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-3 mb-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Cari Rekomendasi
        </button>

        {errorMessage && <div className="text-red-500 text-sm mt-4">{errorMessage}</div>}

        {recommendations.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6">
            {recommendations.map((site, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={site.imgUrl}
                  alt={site.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{site.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{site.description}</p>
                  <div className="mt-4 text-lg font-semibold text-blue-600">
                    Rp {site.price.toLocaleString('id-ID')} / Malam
                  </div>
                  <button
                    onClick={() => handleSelectSite(site)}
                    className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Detail Tempat Kemah
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Detail Tempat Kemah */}
        {selectedSite && !showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6 relative overflow-y-auto max-h-screen">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <img
                src={selectedSite.imgUrl}
                alt={selectedSite.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800">{selectedSite.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{selectedSite.description}</p>
              {/* <p className="text-lg font-semibold text-blue-600 mt-4">{selectedSite.price} / malam</p> */}
              <div className="mt-4 text-lg font-semibold text-blue-600">
                Rp {selectedSite.price.toLocaleString('id-ID')} / Malam
              </div>
              <p className="text-gray-700 mt-4">Fasilitas: {selectedSite.facilities.join(', ')}</p>
              <h4 className="text-xl font-semibold text-gray-800 mt-4">Ulasan:</h4>
              <ul className="mt-2">
                {selectedSite.reviews.length > 0 ? (
                  selectedSite.reviews.map((review, index) => (
                    <li key={index} className="text-sm text-gray-700 mb-6">
                      
                      <strong>{review.user}:</strong> {review.comment} <br />
                      <div className='flex-row flex'>
                      <p className='mr-2'>Foto : </p>{review.img && review.img !== 'null' && (
                         <img src={review.img} alt={`${review.user}'s review`} className="rounded-xl w-52 h-32 mt-2 border-2-black" />
                      )}
                      </div>
                      {/* <span className="text-yellow-500">⭐ {review.rating}</span> */}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-700">Ulasan tidak tersedia</li>
                )}
              </ul>
              <div className="mt-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                >
                  Tambah Ulasan
                </button>
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
            <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6 relative overflow-y-auto max-h-screen">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h3 className="text-2xl font-bold text-gray-800">Formulir Pemesanan</h3>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600">Tanggal Kedatangan</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={bookingDetails.arrivalDate}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600">Total Harga</label>
                <input
                  type="text"
                  value={`Rp. ${bookingDetails.totalPrice.toLocaleString()}`}
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
        {/* Tambah Ulasan */}
        {/* Review Form */}
{showReviewForm && selectedSite && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 lg:w-1/3 p-6 relative overflow-y-auto max-h-screen">
      <button
        onClick={() => setShowReviewForm(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>
      <h3 className="text-2xl font-bold text-gray-800">Tambah Ulasan</h3>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tulis ulasan Anda..."
        ></textarea>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">Pilih Foto</label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => setShowReviewForm(false)}
            className="py-2 px-4 bg-gray-300 text-white rounded-md hover:bg-gray-400 transition duration-200"
          >
            Batal
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Kirim Review
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
