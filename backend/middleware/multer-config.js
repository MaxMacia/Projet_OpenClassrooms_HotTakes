const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg') || file.mimetype.includes('png')) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

module.exports = multer({ storage, fileFilter }).single('image');