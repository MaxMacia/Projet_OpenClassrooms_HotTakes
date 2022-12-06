const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');
const User = require('./models/User');
const Sauce = require('./models/Sauce');
const app = express();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

dotenv.config();

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_SECRET}.ib5vpwf.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(() => console.log("Connexion à MongoDB réussie!"))
.catch(() => console.log("Connexion à MongoDB à échoué!"));

User.watch().on('change', data => console.log(new Date(), data));
Sauce.watch().on('change', data => console.log(new Date(), data));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;