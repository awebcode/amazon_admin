const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken"); // Make sure you have this package installed
const userModel = require("../models/userModel");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  try {
  
    // const token = req?.headers?.authorization?.split(" ")[1]; // Extract token from "Bearer <token>" format
    const token=req.cookies?.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error("No token found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key

    // Assuming you have a User model and a field called `userId` in the token payload
    const user = await userModel.findById(decoded?.id); // Replace with actual fetching logic

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    req.user = user; // Set the user to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
const isAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    const { email } = req.user;

    // Assuming you have a User model with an `isAdmin` field
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.role!=="admin") {
      res.status(403);
      throw new Error("User is not an administrator");
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
const isSubAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    const { email } = req.user;

    // Assuming you have a User model with an `isAdmin` field
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
   
    if (user.role !== "admin" && user.role!=="sub_admin") {
      res.status(403);
      throw new Error("User is not an administrator");
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
module.exports = {authMiddleware,isAdmin,isSubAdmin};
