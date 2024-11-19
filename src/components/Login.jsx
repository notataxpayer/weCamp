import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials
  const hardcodedUsernameUser = 'user';
  const hardcodedPasswordUser = 'user';
  const hardcodedUsernameAdmin = 'admin';
  const hardcodedPasswordAdmin = 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifikasi username dan password
    if (email === hardcodedUsernameUser && password === hardcodedPasswordUser) {
      // Jika username user, navigasi ke /dashboard
      navigate('/dashboard');
    } else if (email === hardcodedUsernameAdmin && password === hardcodedPasswordAdmin) {
      // Jika username admin, navigasi ke /admin
      navigate('/admin');
    } else if(email === "" || password === ""){
      toast.error('Mohon isi semua data yang diperlukan')
    } 
    else {
      // Jika login gagal
      toast.error('Mohon isi semua data yang diperlukan')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
