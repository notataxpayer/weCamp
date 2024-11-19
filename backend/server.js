const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb3JuYnJka2Foa3lidXlmdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjEyNTUsImV4cCI6MjA0NzQ5NzI1NX0.TkHzC2EX-HscUpnjMxEBYLQahaMtUFza3wONZ2WPWrM"

const app = express();
const port = 5000;

// Setup Supabase
const supabase = createClient(supabaseUrl, supabaseKey)
app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Query ke tabel credentials untuk mencari email dan password
  const { data, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    return res.status(401).json({ success: false, message: 'Email atau password salah' });
  }

  return res.json({ success: true, message: 'Login berhasil' });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
