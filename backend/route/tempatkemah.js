const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Supabase setup
const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb3JuYnJka2Foa3lidXlmdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjEyNTUsImV4cCI6MjA0NzQ5NzI1NX0.TkHzC2EX-HscUpnjMxEBYLQahaMtUFza3wONZ2WPWrM";
const supabase = createClient(supabaseUrl, supabaseKey);


// Create
router.post('/', async (req, res) => {
    const { nama, gambar, deskripsi, harga, fasilitas, region } = req.body;
  
    // Validasi input
    if (!nama || !gambar || !deskripsi || !harga || !fasilitas || !region) {
      return res.status(400).json({ success: false, message: 'All fields must be provided' });
    }
  
    // Melakukan insert dan mengembalikan data yang baru dimasukkan
    const { data, error } = await supabase
      .from('tempat_kemah')
      .insert([{ nama, gambar, deskripsi, harga, fasilitas, region }])
      .select('*'); // Tambahkan .select('*') untuk mendapatkan data yang baru dimasukkan
  
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  
    return res.status(201).json({ success: true, data }); // Pastikan data dikembalikan
  });
// Read (Get All)
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('tempat_kemah').select('*');
    // console.log('Supabase data:', data); 
    console.log('Supabase error:', error); 
    if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, data });
});

// Read (Get by ID)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('tempat_kemah')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(404).json({ success: false, message: error.message });
    }

    return res.json({ success: true, data });
});

// Update
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, gambar, deskripsi, harga, fasilitas, region } = req.body;

    const { data, error } = await supabase
        .from('tempat_kemah')
        .update({ nama, gambar, deskripsi, harga, fasilitas, region })
        .eq('id', id);

    if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, data });
});

// Delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('tempat_kemah')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({ success: true, message: 'Tempat kemah berhasil dihapus', data });
});

// searching 
router.get('/search', async (req, res) => {
    const { region, nama } = req.query;
  
    // Menangani pencarian berdasarkan parameter
    let query = supabase.from('tempat_kemah').select('*');
  
    if (region) {
      query = query.ilike('region', `%${region}%`);
    }
  
    if (nama) {
      query = query.ilike('nama', `%${nama}%`);
    }
  
    const { data, error } = await query;
  
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  
    console.log('Search Data:', data);  // Menampilkan data hasil pencarian
  
    return res.json({ success: true, data });
  });
  
  
  
  
  
  



module.exports = router;
