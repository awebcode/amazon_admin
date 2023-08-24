import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getAColor, getColors } from "../features/color/colorSlice";
import { Input, Select, Tag } from "antd";
import Dropzone from "react-dropzone";
import { PacmanLoader } from "react-spinners";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  getProducts,
  getSingleProducts,
  resetState,
  updateProducts,
} from "../features/product/productSlice";
import { getMyDetails } from "../features/auth/authSlice";
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  type: yup.string().required("Type is Required"),
  sort: yup.string().required("SortType is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  stock: yup.string().required("Stock is Required"),
  slug: yup.string().required("Slug is Required"),
  // tags: yup.string().required("Tags is Required"),
  color: yup.array().min(1, "Pick at least one color").required("Color is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (id && id !== "undefined") {
      dispatch(getSingleProducts(id));
    }
      dispatch(getMyDetails());

    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [dispatch, id]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const colorName = useSelector((state) => state.color.colorName);

  const imgState = useSelector((state) => state.upload.images);
  const { isLoading: imgUloading } = useSelector((state) => state.upload);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    isCreateError,
    isUpdateError,
  } = newProduct;
  const productState = useSelector((state) => state.product.products);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
      navigate("/admin/list-product");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfullly!");
      navigate("/admin/list-product");
      if (id !== "undefined") {
        dispatch(getSingleProducts(id));
      }
      dispatch(getProducts());
      dispatch(resetState());
    }
    if (isError) {
      toast.error("Something Went Wrong!");
      dispatch(resetState());
    }
    if (isUpdateError) {
      toast.error("Something Went Wrong Create Product!");
      dispatch(resetState());
    }
    if (isCreateError) {
      toast.error("Something Went Wrong Update Product!");
      dispatch(resetState());
    }
  }, [
    isSuccess,
    isError,
    isLoading,
    dispatch,
    updatedProduct,
    toast,
    isUpdateError,
    isCreateError,
  ]);
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: i.title,
      value: i.title,
    });
  });
  //  console.log("colorpt", coloropt);

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });
  useEffect(() => {
    // Set initial form values when product data is available
    if (id && productState) {
      formik.setValues({
        id: productState._id,
        title: productState.title,
        type: productState?.type,
        sort: productState?.sort,
        stock: productState?.stock,
        slug: productState?.slug,
        tags: productState?.tags,
        description: productState.description,
        price: productState.price,
        brand: productState.brand,
        category: productState.category,

        color: productState.color?.length > 0 ? productState.color?.map((c) => c) : [],

        images: productState.images,
      });

      setImages(productState.images);
      setTags(productState?.tags);
    }
  }, [id, productState, dispatch, color]);

  useEffect(() => {
    formik.values.color = color || [];
    formik.values.images = img;
  }, [color, img]);
  const formik = useFormik({
    initialValues: {
      id: id,
      title: "",
      description: "",
      type: "",
      sort: "",
      stock: "",
      slug: "",
      tags: "",
      price: "",
      brand: "",
      category: "",

      color: [],

      images: [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (id) {
        const updatedImages = [...productState.images, ...values.images].filter(
          (image) => !removedImages.includes(image.public_id)
        );

        const updatedColors = [...values.color]; // Fixed typo here

        const updatedValues = {
          ...values,
          color: updatedColors.map((c) => c), // Extract _id values for color
          images: updatedImages,
        };

        dispatch(updateProducts(updatedValues));
        formik.setFieldValue("images", [...productState.images]);
         
         formik.resetForm();
         dispatch(resetState());
          dispatch(getProducts());
      } else {
        dispatch(createProducts(values));
         formik.setFieldValue("images", []);
        formik.resetForm();
         
       dispatch(resetState());
       dispatch(getProducts());
        
      }
    },
  });
  //  console.log("formikvalues", formik.values);
  const handleColors = (selectedColors, j) => {
    setColor(selectedColors);
  };
  // Add a state variable to keep track of removed images
  const [removedImages, setRemovedImages] = useState([]);

  // Inside your removeImg function
  const removeImg = (id) => {
    const updatedImages = images.filter((image) => image.public_id !== id);
    setImages(updatedImages); // Update the images in state
    setRemovedImages([...removedImages, id]); // Add the removed image ID to removedImages state
  };
  const tagRender = (props) => {
    const { label, value, closable, onClose, title } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    // console.log("tagprops",props)
    return (
      <Tag
        color={label}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  //tags

  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);

  const handleClose = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      formik.setFieldValue("tags", [...tags, inputValue]);
    }
    setInputValue("");
    setInputVisible(false);
  };

  return (
    <div>
      <h3 className="mb-4 title">{id && id ? "Update Product" : "Add Product"}</h3>
      <div>
        <form onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title || (productState && productState.title)}
          />
          <div className="error">{formik.touched.title && formik.errors.title}</div>

          <CustomInput
            type="text"
            label="Enter Unique Product slug"
            name="slug"
            onChng={formik.handleChange("slug")}
            onBlr={formik.handleBlur("slug")}
            val={formik.values.slug || (productState && productState.slug)}
          />
          <div className="error">{formik.touched.slug && formik.errors.slug}</div>

          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              flexWrap: "wrap",
            }}
          >
            {tags &&
              tags.map((tag) => (
                <Tag key={tag} closable onClose={() => handleClose(tag)}>
                  {tag}
                </Tag>
              ))}
            {inputVisible && (
              <Input
                type="text"
                size="small"
                // style={{ width: 18 }}
                className="form-control"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            )}

            <Tag
              onClick={() => setInputVisible(true)}
              style={{ background: "#fff", borderStyle: "dashed" }}
            >
              + Add Product Tag
            </Tag>
          </div>
          {/* <div className="error">{formik.touched.tags && formik.errors.tags}</div> */}
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">{formik.touched.price && formik.errors.price}</div>
          <CustomInput
            type="number"
            label="Enter Product Stock"
            name="stock"
            onChng={formik.handleChange("stock")}
            onBlr={formik.handleBlur("stock")}
            val={formik.values.stock}
          />
          <div className="error">{formik.touched.stock && formik.errors.stock}</div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">{formik.touched.brand && formik.errors.brand}</div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((mainCategory, index) => (
              <optgroup key={index} label={mainCategory.title}>
                {mainCategory.subcategories.map((subcategory, subIndex) => (
                  <option key={subIndex} value={subcategory} style={{ color: "#000" }}>
                    {subcategory}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="error">{formik.touched.category && formik.errors.category}</div>

          {/* <div className="error">{formik.touched.category && formik.errors.category}</div> */}
          <select
            name="type"
            onChange={formik.handleChange("type")}
            onBlur={formik.handleBlur("type")}
            value={formik.values.type}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Company">Company</option>
            <option value="Public">Public</option>
            <option value="Public Business">Public Business</option>
          </select>
          <div className="error">{formik.touched.type && formik.errors.type}</div>
          <select
            name="sort"
            onChange={formik.handleChange("sort")}
            onBlur={formik.handleBlur("sort")}
            value={formik.values.sort}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select SortType
            </option>
            <option value="New">New</option>
            <option value="Old">Old</option>
            <option value="Popular">Popular</option>
            <option value="Special">Special</option>
            <option value="Best">Best</option>
          </select>
          <div className="error">{formik.touched.sort && formik.errors.sort}</div>
          {console.log("colorformik", formik.values.color)}
          <Select
            mode="multiple"
            allowClear
            tagRender={tagRender}
            className="w-100"
            placeholder="Select colors"
            // value={
            //   formik.values.color.map((x) => {
            //     return {
            //       label: x,
            //     };
            //   }) ||
            //   (productState &&
            //     productState.color.map((v) => {
            //       return {
            //         label: v,
            //       };
            //     }))
            // }
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />
          <div className="error">{formik.touched.color && formik.errors.color}</div>

          <div className="bg-white border-1 p-5 text-center">
            {imgUloading ? (
              <PacmanLoader color="#36d7b7" />
            ) : (
              <>
                <Dropzone onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </>
            )}
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {img &&
              img.map((i, j) => {
                return (
                  <div className=" position-relative" key={j}>
                    <button
                      type="button"
                      onClick={() => dispatch(delImg(i.public_id))}
                      className="btn-close position-absolute"
                      style={{ top: "10px", right: "10px" }}
                    ></button>
                    <img src={i.url} alt="" width={200} height={200} />
                  </div>
                );
              })}
            {images &&
              images.map((i, j) => {
                return (
                  <div className=" position-relative" key={j}>
                    <button
                      type="button"
                      onClick={() => removeImg(i.public_id)}
                      className="btn-close position-absolute"
                      style={{ top: "10px", right: "10px" }}
                    ></button>
                    <img src={i.url} alt="" width={100} height={100} />
                  </div>
                );
              })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
            // disabled={isLoading}
          >
            {id && id
              ? isLoading
                ? "Updating..."
                : "Update Product"
              : isLoading
              ? "Creating..."
              : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
