const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
dbConnect();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use(fileUpload());

app.use(
  cors({
    origin: "https://adminamazon.vercel.app", //http://localhost:3000//https://adminamazon.vercel.app
    credentials: true,
    methods: "GET,HEAD,PUT,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    
  })
);
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
  res.json("<h1>Hello World</h1>");
});
//build for vercel

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
