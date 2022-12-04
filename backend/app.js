const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const app = express();

const userRoutes = require('./routes/user');

mongoose.connect(
    "mongodb+srv://MaxMacia:211089Mn@cluster0.ib5vpwf.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(() => console.log("Connexion à MongoDB réussie!"))
.catch(() => console.log("Connexion à MongoDB à échoué!"));

User.watch().on('change', data => console.log(new Date(), data));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;