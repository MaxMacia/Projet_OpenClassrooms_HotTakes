const passwordValidator = require('password-validator');

const validatorSchema = new passwordValidator();

validatorSchema
.is().min(6)
.is().max(20)
.has().uppercase()
.has().lowercase()
.has().digits(2);

const passwordErrorsMessages = {
    min: 'Password should be at least 8 characters long',
    max: 'Password should be be a maximum of 64 characters long',
    uppercase: 'Password should have uppercase characters',
    lowercase: 'Password should have lowercase characters',
    digits: 'Password should contain digits'
}

module.exports = (req, res, next) => {
    if (!validatorSchema.validate(req.body.password)) {
        const listValidator = validatorSchema.validate(`${req.body.password}`, { list: true });
        let error = "";
        for (let i = 0; i < listValidator.length; i++) {
            error += passwordErrorsMessages[listValidator[i]]
            if (i != listValidator.length-1) {
                error += ", "
            }
        }
        return res.status(400).json(error);
    }
    next();
}