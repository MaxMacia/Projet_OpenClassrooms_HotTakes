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
    .then(sauce => { res.status(200).json(sauce) })
    .catch(error => {
        const message = "La sauce demandée n'existe pas";
        res.status(404).json({ message });
    });
}

exports.getSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(500).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        switch (true) {
            case !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId) && req.body.like == 1:
                return Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                    )
                .then(() => {
                    const message = "Sauce like +1";
                    res.status(201).json({ message });
                });
                break;
            case sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId) && req.body.like == 0:
                return Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                    )
                .then(() => {
                    const message = "Sauce like 0";
                    res.status(201).json({ message });
                });
                break;
            case !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId) && req.body.like == -1:
                return Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                    )
                .then(() => {
                    const message = "Sauce dislike +1";
                    res.status(201).json({ message });
                });
                break;
            case !sauce.usersLiked.includes(req.body.userId) && sauce.usersDisliked.includes(req.body.userId) && req.body.like == 0:
                return Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                    )
                .then(() => {
                    const message = "Sauce dislike 0";
                    res.status(201).json({ message });
                });
                break;
        }
    })
    .catch(error => res.status(500).json({ error }));
};