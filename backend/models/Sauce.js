const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    useId: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: String, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    userLiked: [{ type: String }],
    userDisliked: [{ type: String }]
});

module.exports = mongoose.model('Sauce', sauceSchema);