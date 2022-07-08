const saucesServices = require("../services/sauces");
exports.getSauces = async (req, res, next) => {
    try {
        const sauces = await saucesServices.getSauces();
        return res.status(200).json(sauces);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.getSauce = async (req, res, next) => {
    const sauceId = req.params.id;
    try {
        const sauce = await saucesServices.getSauce({ _id: sauceId });
        return res.status(200).json(sauce);
    } catch (error) {
        return res.status(404).json({ message: `Error while getting sauce : ${sauceId} `, error });
    }
};

exports.createSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const protocol = req.protocol;
    const localhost = req.get("host");
    const file = req.file;

    try {
        await saucesServices.createSauce(sauceObject, protocol, file, localhost);
        return res.status(200).json({ message: "Sauce créée !" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Failed to create sauce", error });
    }
};

exports.modifySauce = async (req, res, next) => {
    const { file, body, protocol } = req;
    const sauce = req.body.sauce;
    const id = req.params.id;
    const localhost = req.get("host");

    try {
        await saucesServices.modifySauce(file, sauce, protocol, body, id, localhost);
        return res.status(200).json({ message: "Sauce trouvée !" });
    } catch (error) {
        return res.status(404).json({ message: "Sauce non trouvée", error });
    }
};

exports.deleteSauce = async (req, res, next) => {
    try {
        await saucesServices.deleteSauce({ _id: req.params.id });
        return res.status(200).json({ message: "Sauce supprimée !" });
    } catch (error) {
        return res.status(400).json({ message: "Sauce non trouvée", error });
    }
};

exports.likeSauce = async (req, res, next) => {
    const { id } = req.params;
    const { like, userId } = req.body;
    try {
        await saucesServices.likeSauce(id, like, userId);
        res.status(200).json({ message: "Like mis à jours" });
    } catch (error) {
        res.status(403).json({ message: "Status de like non modifié", error });
    }
};
