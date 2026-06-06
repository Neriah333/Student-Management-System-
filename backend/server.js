const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { sequelize, connectDB } = require('./config/db');

// Load all models + associations
require('./models');

const app = express();

app.use('/api/classstreams', require('./routes/streamRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/results', require('./routes/gradingscaleRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;


// ======================
// START SERVER
// ======================
const startServer = async () => {
  try {
    await connectDB();

    console.log('Database connected successfully');

    // safer sync (avoid alter in production)
    await sequelize.sync();

    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(' Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();