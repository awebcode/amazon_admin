const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    orderItems:Array,
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Processing",
     
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
