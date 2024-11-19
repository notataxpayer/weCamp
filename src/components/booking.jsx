import React, { useState } from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QRCodeSVG } from 'qrcode.react';

// Set App element for accessibility (React Modal requirement)
Modal.setAppElement('#root');

const Booking = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: 'Taman Nasional Bali Barat',
      imgUrl: 'https://res.cloudinary.com/dnyrrcacd/image/upload/v1732029182/APS/aaa_h1jcr1.jpg',
      description: 'Tempat yang indah dengan pemandangan alam yang mempesona.',
      price: 'Rp 50.000 / malam',
      status: 'Belum Dibayar',
      jumlah_orang: 1,
      jumlah_hari: 1,
      paymentTime: null,
      bookingDate: '2024-11-15',
      ticketId: 'TICKET1234',
      address: 'Jalan Raya Taman Nasional Bali Barat, Bali, Indonesia',
      googleMapsUrl: 'https://maps.app.goo.gl/7bQHyRQuwfMoB3W58',
    },
    // Additional bookings here...
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showVA, setShowVA] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBooking(null);
    setShowPaymentMethod(false);
    setSelectedPaymentMethod(null);
    setShowVA(false);
    setShowTicket(false);
  };

  const handleSelectPaymentMethod = () => {
    if (!selectedPaymentMethod) {
      toast.error('Silakan pilih metode pembayaran terlebih dahulu.');
      return;
    }
    setShowVA(true);
  };

  const handlePayment = () => {
    if (!selectedBooking) return;
    setShowPaymentMethod(true);
  };

  const handleFinishPayment = () => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id
        ? { ...booking, status: 'Sudah Dibayar', paymentTime: new Date() }
        : booking
    );
    setBookings(updatedBookings);
    toast.success('Selamat pesanan anda berhasil terkonfirmasi.');
    closeModal();
  };

  const handleDownloadTicket = () => {
    toast.success('Unduh e-Ticket berhasil.');
  };

  const handleShowTicket = () => {
    setQrCodeData(`${selectedBooking.name} - ${selectedBooking.status}`);
    setShowTicket(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Daftar Booking Anda</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="flex flex-col p-4 flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{booking.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{booking.description}</p>
              <p className="text-lg text-gray-800 font-semibold mt-4">{booking.price}</p>
              <p
                className={`text-sm font-bold mt-2 ${
                  booking.status === 'Sudah Dibayar' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {booking.status}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Tanggal Booking: {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
              </p>
              <button
                onClick={() => openModal(booking)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Selengkapnya
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Booking Details */}
      {selectedBooking && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detail Booking"
          className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
        >
          <div>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedBooking.name}</h3>
            <img
              src={selectedBooking.imgUrl}
              alt={selectedBooking.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-md text-gray-600">Alamat : {selectedBooking.address}. <a
              href={selectedBooking.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              Google Maps
            </a></p>
            <p className="text-sm text-gray-600 mb-1 flex">
              Tanggal Booking :<p className="ml-1 font-bold">{format(new Date(selectedBooking.bookingDate), 'dd MMM yyyy')}</p>
            </p>
            <p className="text-sm text-gray-600 mb-1 flex">
              Jumlah Orang :<p className="ml-1 font-bold">{selectedBooking.jumlah_orang}</p>
            </p>
            <p className="text-sm text-gray-600 mb-1 flex">
              Jumlah Hari :<p className="ml-1 font-bold">{selectedBooking.jumlah_hari}</p>
            </p>
            <p className="text-lg font-semibold text-gray-800">{selectedBooking.price}</p>
            <p
              className={`text-sm font-bold mt-2 ${
                selectedBooking.status === 'Sudah Dibayar' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              Status: {selectedBooking.status}
            </p>
            {selectedBooking.paymentTime && (
              <p className="text-sm text-gray-600 mt-2">
                Dibayar pada: {format(new Date(selectedBooking.paymentTime), 'dd MMM yyyy HH:mm')}
              </p>
            )}

            {selectedBooking.status === 'Belum Dibayar' ? (
              <button
                onClick={handlePayment}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Bayar Sekarang
              </button>
            ) : (
              <div>
                <button
                  onClick={handleDownloadTicket}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Unduh e-Ticket
                </button>
                <button
                  onClick={handleShowTicket}
                  className="mt-4 ml-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  Tampilkan e-Ticket
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethod && (
        <Modal
          isOpen={showPaymentMethod}
          onRequestClose={closeModal}
          contentLabel="Pilih Metode Pembayaran"
          className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
        >
          <div>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">Pilih Metode Pembayaran</h3>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedPaymentMethod('Go-Pay')}
                className={`w-full py-2 px-4  font-semibold rounded-lg transition ${selectedPaymentMethod === 'Go-Pay' ? 'bg-blue-500 text-white' : 'bg-slate-300'}`}
              >
                Go-Pay
              </button>
              <button
                onClick={() => setSelectedPaymentMethod('BCA')}
                className={`w-full py-2 px-4 font-semibold rounded-lg transition ${selectedPaymentMethod === 'BCA' ? 'bg-blue-500 text-white' : 'bg-slate-300'}`}
              >
                BCA
              </button>
            </div>
            <button
              onClick={handleSelectPaymentMethod}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </Modal>
      )}

      {/* Virtual Account (VA) Modal */}
      {showVA && (
        <Modal
          isOpen={showVA}
          onRequestClose={closeModal}
          contentLabel="Virtual Account"
          className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
        >
          <div>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold mb-4">Nomor Virtual Account (VA)</h3>
            <p className="text-xl text-gray-800">Silakan lakukan pembayaran ke nomor VA berikut:</p>
            <p className="text-xl text-blue-500 font-bold">{selectedPaymentMethod === 'Go-Pay' ? '123456789' : '987654321'}</p>
            <p className="text-gray-600 mt-4">Mohon pastikan pembayaran telah berhasil dan lakukan konfirmasi pembayaran.</p>
            <button
              onClick={handleFinishPayment}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </Modal>
      )}

      {/* Ticket Modal */}
      {showTicket && (
  <Modal
    isOpen={showTicket}
    onRequestClose={() => setShowTicket(false)}
    contentLabel="e-Ticket"
    className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg relative"  // Added mt-12 to add margin-top
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 py-8"  // Added py-8 for padding
  >
    <div className="relative">
      <button
        onClick={() => setShowTicket(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✖
      </button>

      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-indigo-600 mb-2">e-Ticket</h3>
        <h3 className="text-2xl font-semibold text-gray-800">{selectedBooking.name}</h3>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4">
        <QRCodeSVG value={qrCodeData} size={256} className="mx-auto mb-4 border-4 border-indigo-500 rounded-md" />
        <p className="text-lg font-semibold text-gray-800 text-center">Ticket ID: {selectedBooking.ticketId}</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <p className="text-sm text-gray-600 mb-1">Alamat: <span className="font-semibold">{selectedBooking.address}</span></p>
        <p className="text-sm text-gray-600 mb-1">Tanggal Booking: <span className="font-semibold">{format(new Date(selectedBooking.bookingDate), 'dd MMM yyyy')}</span></p>
        <p className={`text-sm font-bold mt-2 ${selectedBooking.status === 'Sudah Dibayar' ? 'text-green-500' : 'text-red-500'}`}>
          Status: {selectedBooking.status}
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleDownloadTicket}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Unduh e-Ticket
        </button>
      </div>
    </div>
  </Modal>
)}


      <ToastContainer />
    </div>
  );
};

export default Booking;
