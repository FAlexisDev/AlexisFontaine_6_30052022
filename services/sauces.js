const Sauces = require("../models/Sauces");
exports.getSauces = async () => {
    return await Sauces.find();
};

exports.getSauce = async (id) => {
    return await Sauces.findOne(id);
};

exports.createSauce = async (sauceObject, protocol, file, localhost) => {
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${protocol}://${localhost}/images/${file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });

    return await sauce.save();
};

exports.modifySauce = async (file, sauce, protocol, body, id, localhost) => {
    const sauceObject = file
        ? {
              ...JSON.parse(sauce),
              imageUrl: `${protocol}://${localhost}/images/${file.filename}`,
          }
        : { ...body };

    return await Sauces.updateOne({ _id: id }, { ...sauceObject });
};

exports.deleteSauce = async (id) => {
    return await Sauces.deleteOne(id);
};

exports.likeSauce = async (id, like, userId) => {
    const sauce = await Sauces.findOne({ _id: id });
    const likeStatus = like;
    switch (likeStatus) {
        case 1:
            if (sauce.usersLiked.includes(userId)) {
                sauce.userLiked.splice(0, 1);
            }
            sauce.usersLiked.push(userId);
            break;
        case -1:
            if (sauce.usersDisliked.includes(userId)) {
                sauce.usersDisliked.splice(0, 1);
            }
            sauce.usersDisliked.push(userId);
            break;

        case 0:
            sauce.usersLiked = sauce.usersLiked.filter((user) => {
                return user != userId;
            });

            sauce.usersDisliked = sauce.usersDisliked.filter((user) => {
                return user != userId;
            });
            break;
    }
    return await sauce.updateOne({
        _id: id,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.usersLiked.length,
        dislikes: sauce.usersDisliked.length,
    });
};
