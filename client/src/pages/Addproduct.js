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
import axios from "axios";
import { config } from "../utils/axiosconfig";
import { base_url } from "../utils/baseUrl";
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
  colorState &&
    colorState.forEach((i) => {
      coloropt.push({
        label: i.title,
        value: i.title,
      });
    });
  //  console.log("colorpt", coloropt);

  // Combine existing and uploaded images
  const [img, setImg] = useState([]);

  useEffect(() => {
    const newImages = imgState.map((i) => ({
      public_id: i.public_id,
      url: i.url,
    }));

    setImg((prevImages) => [...prevImages, ...newImages]);
  }, [imgState]); // Use imgState instead of img

  // Update formik values when images change
  useEffect(() => {
    formik.values.images = img;
  }, [img]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [Type, setType] = useState("");
  const [Brand, setBrand] = useState("");
  const [Sort, setSort] = useState("");
  const [Stock, setStock] = useState(0);
  const [Slug, setSlug] = useState("");
  const [Tags, setTagss] = useState([]);
  const [Price, setPrice] = useState(0);
  const [Category, setCategory] = useState("");

  useEffect(() => {
    // Set initial form values when product data is available
    if (id && productState) {
      formik.setValues({
        id: productState._id,

        // title: productState.title,
        // type: productState?.type,
        // sort: productState?.sort,
        // stock: productState?.stock,
        // slug: productState?.slug,
        // tags: productState?.tags,
        // description: productState?.description,
        // price: productState?.price,
        // brand: productState?.brand,
        // category: productState?.category,

        color:
          productState && productState.color?.length > 0
            ? productState.color?.map((c) => c)
            : [],

        // images: productState.images,
      });
      // setPrice(productState?.price);
      // setStock(productState?.stock);
      setImages(productState.images);
      setTags(productState?.tags);
    }
  }, [id, productState, dispatch, color, productState.images]);

  useEffect(() => {
    formik.values.color = color;
   
  }, [color]);
  //tags

  const [inputValue, setInputValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);

  const handleClose = (tagToRemove) => {
    const updatedTags = tags && tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    formik.setFieldValue("tags", [...updatedTags]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      formik.setValues({
        tags: [...tags, inputValue],
      }); // Use the callback version

      // Clear input after setting field value
      setInputValue("");
      setInputVisible(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      id: id !== undefined ? productState?._id : "",
      title: id !== undefined ? productState?.title : "",
      description: id !== undefined ? productState?.description : "",
      type: id !== undefined ? productState?.type : "",
      sort: id !== undefined ? productState?.sort : "",
      stock: id !== undefined ? productState?.stock : "",
      slug: id !== undefined ? productState?.slug : "",
      tags: [],
      price: id !== undefined ? productState?.price : "",
      brand: id !== undefined ? productState?.brand : "",
      category: id !== undefined ? productState?.category : "",

      color: [],

      images: [],
    },

    validationSchema: !id && schema,
    onSubmit: (values) => {
      if (id !== undefined) {
        const updatedImages = [...images, ...img];
        const finalImages = updatedImages.filter(
          (img) =>
            !removedImages.some((removedImg) => removedImg.public_id === img.public_id)
        );

        const updatedColors = [...color]; // Fixed typo here
        
        const updatedValues = {
          ...values,

          title: title ? title : formik.values.title,
          type: Type ? Type : formik.values.type,
          sort: Sort ? Sort : formik.values.sort,
          stock: Stock ? Stock : formik.values.stock,
          slug: Slug ? Slug : formik.values.slug,
          description: description ? description : formik.values.description,
          price: Price ? Price : formik.values.price,
          brand: Brand ? Brand : formik.values.brand,
          category: Category ? Category : formik.values.category,
          color: updatedColors && updatedColors?.map((c) => c), // Extract _id values for color
          images: finalImages,
        };
        //  console.log(updatedValues);
        dispatch(updateProducts(updatedValues));
        // formik.setFieldValue("images", [...productState.images]);

        formik.resetForm();
        setTimeout(() => {
          formik.resetForm();

          dispatch(resetState());
          dispatch(getProducts());
          formik.resetForm();
        }, 300);
      } else {
        dispatch(createProducts(values));
        // formik.setFieldValue("images", []);
        formik.resetForm();
        setTimeout(() => {
          formik.resetForm();

          dispatch(resetState());
          dispatch(getProducts());
          formik.resetForm();
        }, 300);
      }
    },
  });
  //  console.log("formikvalues", formik.values);
  const handleColors = (selectedColors, j) => {
    setColor(selectedColors);
  };
  // Add a state variable to keep track of removed images
  const [removedImages, setRemovedImages] = useState([]);
  // Handle image removal
  const deleteImageFromCloudinary = async (public_id) => {
    try {
      const { data } = await axios.delete(
        `${base_url}upload/delete-img/products/${public_id}`,
        config
      );
      if (data?.success) {
        dispatch(resetState());
      } // Assuming your API returns a message
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleRemoveImages = async (public_id) => {
    // Dispatch the action to delete the image from Cloudinary
    await deleteImageFromCloudinary(public_id);

    // Filter out the removed image
    const updatedImages = img.filter((img) => img.public_id !== public_id);

    // Update the state with the updated images array
    setImg(updatedImages);
    setImages(updatedImages);
    // Update the removedImages state to keep track of removed images
    setRemovedImages((prevRemovedImages) => [
      ...prevRemovedImages,
      img.find((img) => img.public_id === public_id),
    ]);
    dispatch(getSingleProducts(id));
  };
  // Handle image removal
  const handleRemoveImg = (public_id) => {
    dispatch(delImg(public_id));
    const updatedImages = img.filter((img) => img.public_id !== public_id);
    const removedImage = img.find((img) => img.public_id === public_id);
    setImg(updatedImages);
    setRemovedImages([...removedImages, removedImage]);
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

  return (
    <div>
      <h3 className="mb-4 title">{id && id ? "Update Product" : "Add Product"}</h3>
      {Object.keys(formik.errors).length > 0 && (
        <div className="error">
          {Object.values(formik.errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div>
        <form onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Title
          </div>
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onChng2={setTitle}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title || (productState && productState.title)}
          />
          {formik.errors.title && (
            <div className="error">{formik.touched.title && formik.errors.title}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Slug
          </div>
          <CustomInput
            type="text"
            label="Enter Unique Product slug"
            name="slug"
            onChng={formik.handleChange("slug")}
            onChng2={setSlug}
            // onBlr={formik.handleBlur("slug")}
            val={formik.values.slug || (productState && productState.slug)}
          />
          {formik.errors.slug && (
            <div className="error">{formik.touched.slug && formik.errors.slug}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Description
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={(value) => {
                formik.handleChange("description")(value); // Call Formik's handleChange with the value
                setDescription(value); // Update local state with the value
              }}
              value={
                formik.values.description || (productState && productState.description)
              }
            />
          </div>
          {formik.errors.description && (
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          )}
          {!id && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                flexWrap: "wrap",
              }}
            >
              <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
                Set Tags
              </div>

              {tags &&
                tags?.map((tag) => (
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
          )}
          {/* <div className="error">{formik.touched.tags && formik.errors.tags}</div> */}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Set Price
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onChng2={setPrice}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price || (productState && productState.price)}
          />
          {formik.errors.price && (
            <div className="error">{formik.touched.price && formik.errors.price}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Set Stock
          </div>
          <CustomInput
            type="number"
            label="Enter Product Stock"
            name="stock"
            onChng={formik.handleChange("stock")}
            onChng2={setStock}
            onBlr={formik.handleBlur("stock")}
            val={formik.values.stock || (productState && productState.stock)}
          />
          {formik.errors.stock && (
            <div className="error">{formik.touched.stock && formik.errors.stock}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select Brand
          </div>
          <select
            name="brand"
            onChange={(e) => {
              const selectedValue = e.target.value;
              formik.handleChange("brand")(selectedValue); // Call Formik's handleChange with the selected value
              setBrand(selectedValue); // Update local state with the selected value
            }}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand || (productState && productState.brand)}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState &&
              brandState.map((i, j) => {
                return (
                  <option key={j} value={i.title}>
                    {i.title}
                  </option>
                );
              })}
          </select>
          {formik.errors.brand && (
            <div className="error">{formik.touched.brand && formik.errors.brand}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select Brand
          </div>
          <select
            name="category"
            onChange={(e) => {
              const selectedValue = e.target.value;
              formik.handleChange("category")(selectedValue);
              setCategory(selectedValue);
            }}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category || (productState && productState.category)}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState &&
              catState.map((mainCategory, index) => (
                <optgroup key={index} label={mainCategory.title}>
                  {/* Main Category Option */}
                  <option value={`${mainCategory.title}`} style={{ color: "#06b6d4" }}>
                    {mainCategory.title}
                  </option>

                  {/* Subcategory Options */}
                  {mainCategory.subcategories &&
                    mainCategory.subcategories.map((subcategory, subIndex) => (
                      <option
                        key={subIndex}
                        value={`${subcategory}`}
                        style={{ color: "#475569" }}
                      >
                        {subcategory}
                      </option>
                    ))}
                </optgroup>
              ))}
          </select>

          {formik.touched.category && (
            <div className="error">
              {formik.touched.category && formik.errors.category}
            </div>
          )}
          {/* <div className="error">{formik.touched.category && formik.errors.category}</div> */}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select Type
          </div>
          <select
            name="type"
            onChange={(value) => {
              formik.handleChange("type")(value);
              setType(value.target.value);
            }}
            // onBlur={formik.handleBlur("type")}
            value={formik.values.type || (productState && productState.type)}
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

          {formik.errors.type && (
            <div className="error">{formik.touched.type && formik.errors.type}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select SortType
          </div>
          <select
            name="sort"
            onChange={(value) => {
              formik.handleChange("sort")(value.target.value);
              setSort(value.target.value);
            }}
            // onBlur={formik.handleBlur("sort")}
            value={formik.values.sort || (productState && productState.sort)}
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
          {formik.errors.sort && (
            <div className="error">{formik.touched.sort && formik.errors.sort}</div>
          )}
          {/* {console.log("colorformik", formik.values.color)} */}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select Colors
          </div>
          <Select
            mode="multiple"
            allowClear
            tagRender={tagRender}
            className="w-100"
            placeholder="Select colors"
            onChange={(i) => handleColors(i)}
            
            defaultValue={coloropt}
            options={coloropt}
           
          />
          {formik.errors.color && (
            <div className="error">{formik.touched.color && formik.errors.color}</div>
          )}
          <div className="error" style={{ fontSize: "15px", color: "Highlight" }}>
            Select Images
          </div>
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
                      onClick={() => handleRemoveImg(i.public_id)}
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
                      onClick={() => handleRemoveImages(i.public_id)}
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
