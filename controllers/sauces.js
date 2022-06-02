const Sauces = require("../models/Sauces");

exports.getSauces = (req, res, next) => {
    Sauces.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    sauce
        .save()
        .then(() => res.status(200).json({ message: "Sauce créée !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body };
    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject })
        .then(() => res.status(200).json({ message: "Sauce trouvée !" }))
        .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            const likeStatus = req.body.like;
            switch (likeStatus) {
                case 1:
                    sauce.likes += 1;
                    sauce.usersLiked.push(req.body.userId);
                    break;
                case -1:
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(req.body.userId);
                    break;

                case 0:
                    sauce.usersLiked = sauce.usersLiked.filter((user) => {
                        if (user == req.body.userId) {
                            sauce.likes -= 1;
                        }
                        return user != req.body.userId;
                    });

                    sauce.usersDisliked = sauce.usersDisliked.filter((user) => {
                        if (user == req.body.userId) {
                            sauce.dislikes -= 1;
                        }
                        return user != req.body.userId;
                    });
                    break;
            }

            sauce
                .updateOne({
                    _id: req.params.id,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked,
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                })
                .then(() => res.status(200).json({ message: "Like mise à jour" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(403).json({ error }));
};
