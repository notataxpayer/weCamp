const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Setup Supabase
const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb3JuYnJka2Foa3lidXlmdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjEyNTUsImV4cCI6MjA0NzQ5NzI1NX0.TkHzC2EX-HscUpnjMxEBYLQahaMtUFza3wONZ2WPWrM'; // Ganti dengan kunci yang benar
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Cek jika email dan password dikirim
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();  // Pastikan hanya mengambil satu hasil
  
      if (error || !data) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Jika login sukses, kirimkan data pengguna
      res.status(200).json({
        message: 'Login successful',
        user: data,
      });
  
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router; 