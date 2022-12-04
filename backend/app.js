const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');
const Sauce = require('./models/Sauce');
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
Sauce.watch().on('change', data => console.log(new Date(), data));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.find()
    .then(sauces => {
        const sauceId = sauces.find(sauce => sauce._id == req.params.id);
        if (sauceId == undefined) {
            const message = "La sauce demandée n'existe pas, veuillez essayer un autre identifiant";
            res.status(404).json({ message });
        } else {
            return Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const message = "Voici la sauce demandée";
                res.status(200).json({ message, sauce });
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
});

app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
    .then(sauces => {
        const message = "Voici la liste des sauces";
        res.status(200).json({ message, sauces });
    })
    .catch(error => res.status(500).json({ error }));
});

app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;