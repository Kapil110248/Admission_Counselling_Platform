const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const examRoute = require('./routes/examRoute');
const sessionRoute = require('./routes/sessionRoute');
const collegeRoute = require('./routes/collegeRoute');
const scholarshipRoute = require('./routes/scholarshipRoute');
const packageRoute = require('./routes/packageRoute');
const notificationRoute = require('./routes/notificationRoute');
const enquiryRoute = require('./routes/enquiryRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const prisma = require('./prisma');

async function checkDbConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully! [MySQL]');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}
checkDbConnection();

// Main Root endpoint test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'Running node-express Prisma datasets frameworks threshold models framed fully sets properly.' });
});

const chatRoute = require('./routes/chatRoute');

// Mounted Endpoints routes setting trigger configurations overlays
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/exams', examRoute);
app.use('/api/colleges', collegeRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/chat', chatRoute);
app.use('/api/scholarships', scholarshipRoute);
app.use('/api/packages', packageRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/enquiry', enquiryRoute);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(String(userId));
    console.log(`User joined room: ${userId}`);
  });

  socket.on('send_message', (data) => {
    // Relay to receiverId's room trigger configurations setups
    socket.to(String(data.receiverId)).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running safely on http://localhost:${PORT}`);
});
