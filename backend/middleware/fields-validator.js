exports.create = (req, res, next) => {
    if (req.body.sauce === undefined) { 
        const error = new Error("données malformées");
        return res.status(400).json(error.message);
     }
    const sauceObject = JSON.parse(req.body.sauce);
    let valid = true;
    for (let field in sauceObject) {
        let trimedValue =  String(sauceObject[field]).trim();
        valid &= trimedValue !== '';
        if (!valid) break
    }
    if (!valid) {
        const error = new Error("champs invalides");
        return res.status(400).json(error.message);
    }
    next();
};

exports.update = (req, res, next) => {
    const sauceObject = req.file ? JSON.parse(req.body.sauce) : req.body;
    let valid = true;
    for (let field in sauceObject) {
        let trimedValue =  String(sauceObject[field]).trim();
        valid &= trimedValue !== '';
        if (!valid) break
    }
    if (!valid) {
        const error = new Error("champs invalides");
        return res.status(400).json(error.message);
    }
    next();
};

    
    