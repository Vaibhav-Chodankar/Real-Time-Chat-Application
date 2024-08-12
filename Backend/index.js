const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')

const app = express();
require('dotenv').config();


app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connection successfull'))
    .catch((err) => console.log(`Error connecting Database : ${err.message}`));

app.get('/', (req, res) => {
    res.send({ execute: true })
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})