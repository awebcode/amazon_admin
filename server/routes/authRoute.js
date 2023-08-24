const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateUser,
  updateUserByAdmin,
  updateUserRole,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getMyOrder,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  singleUserCtrl1,
  singleUserCtrl,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin, isSubAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();
router.post("/register", createUser);
router.post("/forget-password", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/update-password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.get("/single",authMiddleware, singleUserCtrl1);
router.get("/single/:id", singleUserCtrl);
// me
router.put("/update/me", authMiddleware, updateUser);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/all-users",authMiddleware,isSubAdmin, getallUser);
router.get("/get-orders", authMiddleware,isSubAdmin, getOrders);
router.get("/getallorders", authMiddleware, isSubAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isSubAdmin, getAllOrders);
router.get("/single-order/:id", authMiddleware, isSubAdmin, getSingleOrder);
router.get("/getMyOrders", authMiddleware, getMyOrder);
router.put("/order/:id", authMiddleware, isSubAdmin, updateOrder);
//update user by admin
router.put("/update/role/:id", authMiddleware, isAdmin, updateUserRole);
router.put("/update/:id", authMiddleware, isAdmin, updateUserByAdmin);

router.delete("/delete/:id", authMiddleware, isAdmin, deleteaUser);
router.delete("/order/:id", authMiddleware, isAdmin, deleteOrder);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
// router.delete("/:id", deleteaUser);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
