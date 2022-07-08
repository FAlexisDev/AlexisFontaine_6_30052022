const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, process.env.SALT);
        const user = new Users({
            email: req.body.email,
            password: hashedPassword,
        });
        return await user.save();
    } catch {
        res.status(500).send();
    }
};

exports.login = async (req) => {
    Users.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
                console.log(user.password, req.body.password);

                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect" });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: "24h" }),
                });
            })
            .catch((error) => res.status(500).json({ error }));
    });
};
