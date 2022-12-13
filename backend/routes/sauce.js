const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const fieldsValidator = require('../middleware/fields-validator');

router.post('/', auth, multer, fieldsValidator.create, sauceCtrl.createSauce);
router.put('/:id', auth, multer, fieldsValidator.update, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;