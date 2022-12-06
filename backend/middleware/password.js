const passwordValidator = require('password-validator');

const validatorSchema = new passwordValidator();

validatorSchema
.is().min(6)
.is().max(20)
.has().uppercase()
.has().lowercase()
.has().digits(2);

module.exports = (req, res, next) => {
    if (!validatorSchema.validate(req.body.password)) {
        const error = `Le mot de passe est insuffisant ${validatorSchema.validate(`${req.body.password}`, { list: true })}`;
        return res.status(400).json(error);
    }
    next();
}