const validator = require('validator');

module.exports = (req, res, next) => {
    const validEmail = validator.isEmail(`${req.body.email}`);
    if (!validEmail) {
        const error = new Error("Email invalide");
        return res.status(400).json(error.message);
    }
    next()
};