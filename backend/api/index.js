const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const tempatKemahRoutes = require('./route/tempatkemah');
const authRoutes = require('./route/auth'); // Mengimpor auth.js

const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsb3JuYnJka2Foa3lidXlmdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjEyNTUsImV4cCI6MjA0NzQ5NzI1NX0.TkHzC2EX-HscUpnjMxEBYLQahaMtUFza3wONZ2WPWrM'; // Ganti dengan kunci yang benar
const app = express();
const port = 5000;

// Setup Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
app.use(cors({
  origin: 'http://localhost:5173',  // Sesuaikan dengan frontend Anda
  methods: 'GET,POST',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secretKey', // Ganti dengan kunci yang lebih aman
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// Menambahkan routes

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use('/tempat_kemah', tempatKemahRoutes);
app.use('/auth', authRoutes); 

// app.get("/", (req, res) => res.send("Express on Vercel"));
// app.listen(3000, () => console.log("Server ready on port 3000."));

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

