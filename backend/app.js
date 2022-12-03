const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const app = express();

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

app.post('/api/auth/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        return user.save()
        .then(() => {
            const message = "Utilisateur enregistré";
            res.status(201).json(message);
        })
    })
    .catch(error => res.status(500).json({ error }));
});

app.post('/api/auth/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user == null) {
            const message = "Paire identifiant/mot de passe invalide";
            res.status(401).json({ message });
        } else {
            return bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    const message = "Paire identifiant/mot de passe invalide";
                    res.status(401).json({ message });
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'                        
                    });
                }
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
});

module.exports = app;