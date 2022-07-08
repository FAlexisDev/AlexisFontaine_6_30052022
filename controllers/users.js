const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersServices = require("../services/users");
require("dotenv").config();
exports.signup = async (req, res, next) => {
    try {
        await usersServices.signup(req);
        return res.status(201).json({ message: "Utilisateur créé ! " });
    } catch (error) {
        return res.status(400).json({ message: "Utilisateur non crée !", error });
    }
};

exports.login = (req, res, next) => {
    Users.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: "24h" }),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
