const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/sauces", auth, saucesCtrl.getSauces);
router.post("/sauces", auth, multer, saucesCtrl.createSauce);
router.get("/sauces/:id", auth, saucesCtrl.getSauce);
router.put("/sauces/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/sauces/:id", auth, saucesCtrl.deleteSauce);
router.post("/sauces/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
