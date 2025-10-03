require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const run = async () => {
  await connectDB(process.env.MONGODB_URI);
  const email = process.env.ADMIN_EMAIL;
  const pwd = process.env.ADMIN_PASSWORD || 'admin123';
  
  let user = await User.findOne({ email });
  if (user) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(pwd, 10);
  user = new User({ email, password: hashed, role: 'admin' });
  await user.save();
  console.log('Admin created:', email);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
