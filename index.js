// require('dotenv').config();
// const express = require('express');
// const app = express();
// const connectDB = require('./config/db');
// const cors = require('cors');

// const PORT = process.env.PORT || 5000;
// connectDB(process.env.MONGODB_URI);

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/jobs', require('./routes/jobs'));
// app.use('/api/contact', require('./routes/contact'));
// app.use('/api/settings', require('./routes/setting'));

// app.get('/', (req, res) => res.send('Job board backend running'));

// app.listen(PORT, () => console.log(`Server started on ${PORT}`));

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const appliedJobRoutes = require("./routes/appliedJobs");

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI);


// Initialize Express
const app = express();
app.use(express.json()); 
app.use(cors({
  origin: 'https://adonis.jaighurudeva.in',
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


app.get('/', (req, res) => res.send('Job board backend running'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
