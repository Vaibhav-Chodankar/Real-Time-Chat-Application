const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoute');
const socket = require('socket.io');

const app = express();
require('dotenv').config();

app.use(express.json());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',  // Allow your frontend's URL
    credentials: true,
}));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/message', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.log(`Error connecting to the database: ${err.message}`));

// Base route
app.get('/', (req, res) => {
    res.send({ execute: true });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Socket.io setup with CORS
const io = socket(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5000',  // Allow your frontend's URL
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],  // Support WebSocket and fallback polling
    allowEIO3: true,  // Enable compatibility mode
});

// Global map for tracking online users
global.onlineUsers = new Map();

// Socket.io connection handler
io.on('connection', (socket) => {
    global.chatSocket = socket;
    console.log(`User connected: ${socket.id}`);

    // Add user to the onlineUsers map
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User added: ${userId} with socket ID: ${socket.id}`);
    });

    // Handle 'send-msg' event
    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit('msg-recieve', data.message);
        } else {
            console.log('User not online or socket not found');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
