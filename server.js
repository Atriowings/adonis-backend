const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


const appliedJobRoutes = require("./routes/appliedJobs");

// Load env variables
dotenv.config();
// Connect to DB
connectDB();
// Initialize Express
const app = express();
app.use(express.json()); 
app.use(cors({
  origin: 'https://adonis.appowise.in',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/hiringRequests', require('./routes/hiringRequests'));
app.use("/api/appliedJobs", appliedJobRoutes);


app.get('/', (req, res) => {
  res.send("Adonis Job Portal Backend is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 CORS allowed origin: ${process.env.CLIENT_URL}`);
});




