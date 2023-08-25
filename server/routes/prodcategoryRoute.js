const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/prodcategoryCtrl");
const { authMiddleware, isAdmin, isSubAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isSubAdmin, createCategory);
router.put("/:id", authMiddleware, isSubAdmin, updateCategory);
router.delete("/:id", authMiddleware, isSubAdmin, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);

module.exports = router;
