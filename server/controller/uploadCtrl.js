const fs = require("fs");
const asyncHandler = require("express-async-handler");
const cloudinary =require("cloudinary")
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const blogModel = require("../models/blogModel");
const productModel = require("../models/productModel");
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader =async (path) =>await cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    // console.log(req.files)
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
});
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteImageFromDb =asyncHandler(async (req, res) => {
  const { collection, public_id } = req.params;

  try {
    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Determine the collection to delete from
    if (collection === "blogs") {
      // Delete image from Blog collection
      const blog = await blogModel.findOne({ images: { $elemMatch: { public_id } } });
      if (blog) {
        blog.images = blog.images.filter((image) => image.public_id !== public_id);
        await blog.save();
        res.json({
          success: true,
          message: "Image deleted from Cloudinary and Blog collection",
        });
      } else {
        res.status(404).json({ message: "Blog not found" });
      }
    } else if (collection === "products") {
      // Delete image from Product collection
      const product = await productModel.findOne({ images: { $elemMatch: { public_id } } });
      if (product) {
        product.images = product.images.filter((image) => image.public_id !== public_id);
        await product.save();
        res.json({success:true, message: "Image deleted from Cloudinary and Product collection" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid collection" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = {
  uploadImages,
  deleteImages,
  deleteImageFromDb,
};
