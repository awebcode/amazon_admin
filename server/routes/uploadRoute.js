const express = require("express");
const { uploadImages, deleteImages, deleteImageFromDb } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware.js");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  // isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-client-img/:id", authMiddleware, deleteImages);
router.delete("/delete-img/:collection/:public_id", authMiddleware, deleteImageFromDb); //isadmin

module.exports = router;
