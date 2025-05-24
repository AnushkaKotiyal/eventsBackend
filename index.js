const express = require('express');
const {sequelize}  = require('./Models/models'); 

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./Routes/userRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const otpRoutes = require('./Routes/otpRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
 
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/book', bookingRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/payments', paymentRoutes);


app.get('/', (req, res) => {
  res.send('API is running!');
});


const startServer = async () => {
  try {
    await sequelize.authenticate();      
    await sequelize.sync();               
    console.log('✅ Database connected successfully.');

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
