const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); // Import Swagger configuration
require('dotenv').config(); // Ensure to load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's origin
  credentials: true, // This is the important part
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
