const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb3JuYnJka2Foa3lidXlmdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjEyNTUsImV4cCI6MjA0NzQ5NzI1NX0.TkHzC2EX-HscUpnjMxEBYLQahaMtUFza3wONZ2WPWrM"
const tempatKemahRoutes = require('./route/tempatkemah');
const app = express();
const port = 5000;


// Setup Supabase
const supabase = createClient(supabaseUrl, supabaseKey)
app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('tempat_kemah').select('*').limit(1);
    if (error) {
      console.error('Supabase Connection Error:', error.message);
    } else {
      console.log('Supabase Connection Successful. Sample data:', data);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
};

// Panggil fungsi untuk tes koneksi
testSupabaseConnection();
//routes
app.use('/tempat_kemah', tempatKemahRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.use(cors());