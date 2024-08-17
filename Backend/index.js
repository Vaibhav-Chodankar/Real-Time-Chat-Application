const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoute');
const socket = require('socket.io');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);
app.use('/api/message', messageRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.log(`Error connecting to the database: ${err.message}`));

app.get('/', (req, res) => {
    res.send({ execute: true });
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;

    // Add user to the onlineUsers map
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    // Listen for 'send-msg' events
    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    });
});
