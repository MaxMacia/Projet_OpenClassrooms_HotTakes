const fs = require('fs');
const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => {
        const message = "Sauce enregistré";
        res.status(201).json({ message })
    })
    .catch(error => res.status(500).json({ error }));
}

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            const message = "requête non-authorisée";
            res.status(403).json({ message });
        } else {
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    return Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => {
                        const message = "Sauce modifiée";
                        res.status(200).json({ message });
                    });
                });
            } else {
                return Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => {
                    const message = "Sauce modifiée";
                    res.status(200).json({ message });
                });
            }
        }
    })
    .catch(error => res.status(500).json({ error }));

}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            const message = "requête non-authorisée";
            res.status(403).json({ message });
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                return Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    const message = "Sauce suprimmé";
                    res.status(200).json({ message });
                });
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// exports.getOneSauce = (req, res, next) => {
//     Sauce.find()
//     .then(sauces => {
//         const sauceId = sauces.find(sauce => sauce._id == req.params.id);
//         if (sauceId == undefined) {
//             const message = "La sauce demandée n'existe pas, veuillez essayer un autre identifiant";
//             res.status(404).json({ message });
//         } else {
//             return Sauce.findOne({ _id: req.params.id })
//             .then(sauce => {
//                 res.status(200).json(sauce);
//             })
//         }
//     })
//     .catch(error => res.status(500).json({ error }));
// }

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce == null) {
            const message = "La sauce demandée n'existe pas";
            res.status(404).json({ message });
        } else { res.status(200).json(sauce) }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(500).json({ error }));
}