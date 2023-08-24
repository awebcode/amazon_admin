const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const productModel = require("../models/productModel");
const sendEmail = require("../utils/sendEmail");


// const sendEmail = require("./emailCtrl");

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser.role === "banned") {
    res.status(400).json({success: false,message:"An admin has banned your account"})
  } 
   if (findUser.role === "disabled") {
     res
       .status(400)
       .json({ success: false, message: "An admin has disabled your account" });
   } 
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 372 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
 try {
   const { email, password } = req.body;
   // check if user exists or not
   const findAdmin = await User.findOne({ email });
   // if (findAdmin.role !== "admin") throw new Error("Not Authorised");
   if (findAdmin.role === "banned") {
     res
       .status(400)
       .json({ success: false, message: "An admin has banned your account" });
   }
   if (findAdmin.role === "disabled") {
     res
       .status(400)
       .json({ success: false, message: "An admin has disabled your account" });
   }
   if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
     const refreshToken = await generateRefreshToken(findAdmin?._id);
     const updateuser = await User.findByIdAndUpdate(
       findAdmin.id,
       {
         refreshToken: refreshToken,
       },
       { new: true }
     );
     res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
       secure: true,
       sameSite: "none",
       maxAge: 372 * 60 * 60 * 1000,
     });
     res.json({
       _id: findAdmin?._id,
       name: findAdmin?.name,
       role: findAdmin?.role,
       email: findAdmin?.email,
       phone: findAdmin?.phone,
       avatar: findAdmin?.avatar,
       token: generateToken(findAdmin?._id),
     });
   } 
 } catch (error) {
   
     throw new Error(error);
   
 }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    // console.log(cookie)
    // if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      
    });
    res.sendStatus(204); // forbidden
  } catch (error) {
    console.log(error)
  }
});

// Update a user
//update pasword

const updateUser = asyncHandler(async (req, res) => {
  
  const { id: userId } = req.user;
  console.log(req.body)
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateFields = {};

    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.email) {
      updateFields.email = req.body.email;
    }
    if (req.body.password) {
      updateFields.password = await bcrypt.hash(req.body.password, 12);
    }
    if (req.body.phone) {
      updateFields.phone = req.body.phone;
    }
    if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, updateFields, {
      new: true,
    });

    res.status(200).json({ message: "User details updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

});
//get single user
const singleUserCtrl1 = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
//get single user by id
const singleUserCtrl = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
//update user role by admin
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { role } = req.body;
console.log(req.body)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ error: "You Are Not An Admin" });
    }
    
    const userUpdate = await User.findByIdAndUpdate({ _id: id }, { role: role },{new:true});

    
    

    res.status(200).json({ success: true, message: "User role updated successfully",userUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
// Update user by admin
const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return res.status(401).json({ error: "You Are Not An Admin" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateFields = {};

    if (req.body.name) {
      updateFields.name = req.body.name;
    }
    if (req.body.email) {
      updateFields.email = req.body.email;
    }
    if (req.body.password) {
      updateFields.password = await bcrypt.hash(req.body.password, 12);
    }
    if (req.body.phone) {
      updateFields.phone = req.body.phone;
    }
    if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: id }, updateFields, {
      new: true,
    });

    res.status(200).json({ message: "User details updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id:userId } = req.user;
  validateMongoDbId(id);

  try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.role !== "admin") {
        return res.status(401).json({ error: "You Are Not An Admin" });
      }
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({success:true,message:"User Deleted successfully",
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // Assuming you're using user authentication middleware

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isPasswordValid = await user.isPasswordMatched(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
     user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `
   Hi, Please follow this link to reset your password. This link is valid for the next 10 minutes:
  <a href="${process.env.CLIENT_URL}/reset-password/${token}">Click Here</a>
`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
     sendEmail(data);
    res.status(200).json({success:true,token,message:`Email sent to ${email}`});
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newpassword } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = newpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ success: true, user ,message:"Password Updated Successfully"});
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(
    2
  );
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("user")
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("user")
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});
const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const order = await Order.findById({ _id: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json({ success: true, order });
  } catch (error) {
    throw new Error(error);
  }
});
//my orders
const getMyOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const orders = await Order.find({user:id}).populate("user")
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(orders );
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

//update order status and product qunatity
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    console.log(req.body);
    if (!order) {
      return res.status(404).json({ message: "Order not found with this Id" });
    }

    order.orderStatus = req.body.status;
    // await order.save();
    // order.orderStatus === "Delivered" && console.log("oix",req.body.status)
    
    
   if (order.orderStatus === "Delivered" && req.body.status === "Delivered") {
     console.log("Transition: Shipped to Delivered");
     order.orderItems.forEach(async (o) => {
       try {
         await updateStockDecrease(o.product, o.quantity);
       } catch (error) {
         console.error("Error in updateStockDecrease:", error);
       }
     });
   } else if (order.orderStatus === "Shipped" && req.body.status === "Shipped") {
     console.log("Transition: Delivered to Shipped");
     order.orderItems.forEach(async (o) => {
       try {
         await updateStockIncrease(o.product, o.quantity);
       } catch (error) {
         console.error("Error in updateStockIncrease:", error);
       }
     });
   }


    await order.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};

async function updateStockDecrease(id, quantity) {
  try {
    console.log("updateStockDecrease");
    const product = await productModel.findById(id);

    if (!product) {
      return; // Handle product not found scenario
    }

    product.stock -= quantity;
    await product.save();
  } catch (error) {
    // Handle error
  }
}

async function updateStockIncrease(id, quantity) {
  try {
     console.log("updateStockIncrease");
    const product = await productModel.findById(id);

    if (!product) {
      return; // Handle product not found scenario
    }

    product.stock += quantity;
    await product.save();
  } catch (error) {
    // Handle error
  }
}


// delete Order -- Admin
const deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found with this Id" });
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
};
module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updateUser,
  singleUserCtrl1,
  singleUserCtrl,
  updateUserByAdmin,
  updateUserRole,
  getMyOrder,
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
  getOrderByUserId,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
