import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  createBlogs,
  getABlog,
  getBlogs,
  resetState,
  updateABlog,
} from "../features/blogs/blogSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";
import { getMyDetails } from "../features/auth/authSlice";
import Bloglist from "./Bloglist";
import { base_url } from "../utils/baseUrl";
import axios from "axios";
import { config } from "../utils/axiosconfig";
import { PacmanLoader } from "react-spinners";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
});

const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  const imgState = useSelector((state) => state.upload.images);
  const { isLoading: imgUloading } = useSelector((state) => state.upload);
  const bCatState = useSelector((state) => state.bCategory.bCategories);
  const blogState = useSelector((state) => state.blogs);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = blogState;

  const [removedImages, setRemovedImages] = useState([]);
  const [images, setImages] = useState([]);

  // Fetch initial data when editing a blog or resetting state
  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
      dispatch(getBlogs());
      formik.setValues({
        title:blogName,
        description: blogDesc,
        category: blogCategory,
        images: blogImages,
      });
      setImages(blogImages);
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getBlogId, blogName, blogDesc, blogCategory, images]);

  // Fetch categories and blogs data
  useEffect(() => {
    dispatch(getMyDetails());
    dispatch(resetState());
    dispatch(getCategories());
    dispatch(getBlogs());
  }, [dispatch]);

  // Handle success, error, and loading states
  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
      setImages([]);
      setRemovedImages([]);
      formik.resetForm();
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, navigate]);

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

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      title: getBlogId !== undefined ? blogName : "",
      description: getBlogId !== undefined ? blogDesc : "",
      category: getBlogId !== undefined ? blogCategory : "",
      images: img,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBlogId !== undefined) {
        const updatedImages = [...images, ...img];
        const finalImages = updatedImages.filter(
          (img) =>
            !removedImages.some((removedImg) => removedImg.public_id === img.public_id)
        );
        // console.log(finalImages)
        const data = { id: getBlogId, blogData: values, images: finalImages };
        dispatch(updateABlog(data));
        formik.resetForm();
       
        setTimeout(() => {
           dispatch(resetState());
           dispatch(getBlogs());
           setImages([]);
           formik.resetForm();
        }, 300);
      } else {
        const finalImages = values.images.filter(
          (img) =>
            !removedImages.some((removedImg) => removedImg.public_id === img.public_id)
        );
        dispatch(createBlogs({ ...values, images: finalImages }));
        formik.resetForm();
        setImages([]);
        setTimeout(() => {
          dispatch(resetState());
          dispatch(getBlogs());
        }, 300);
      }
      setImages([]);
      setRemovedImages([]);
    },
  });
  // Handle image removal
  const deleteImageFromCloudinary = async (public_id) => {
    try {
      const { data } = await axios.delete(
        `${base_url}upload/delete-img/blogs/${public_id}`,config
      );
      if (data?.success) {
        
        dispatch(resetState())
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
    setImages(updatedImages)
    // Update the removedImages state to keep track of removed images
    setRemovedImages((prevRemovedImages) => [
      ...prevRemovedImages,
      img.find((img) => img.public_id === public_id),
    ]);
    dispatch(getABlog(getBlogId && getBlogId));
  };
  // Handle image removal
  const handleRemoveImg = (public_id) => {
    dispatch(delImg(public_id))
    const updatedImages = img.filter((img) => img.public_id !== public_id);
    const removedImage = img.find((img) => img.public_id === public_id);
    setImg(updatedImages);
    setRemovedImages([...removedImages, removedImage]);
  };
  
  return (
    <div>
      <h3 className="mb-4 title">{getBlogId !== undefined ? "Edit" : "Add"} Blog</h3>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-4">
          <CustomInput
            type="text"
            label="Enter Blog Title"
            name="title"
            onChng={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
        </div>
        <div className="error">{formik.touched.title && formik.errors.title}</div>

        <select
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          className="form-control py-3 mt-3"
          id=""
        >
          <option value="">Select Blog Category</option>
          {bCatState.map((i, j) => (
            <option key={j} value={i.title}>
              {i.title}
            </option>
          ))}
        </select>
        <div className="error">{formik.touched.category && formik.errors.category}</div>

        <ReactQuill
          theme="snow"
          className="mt-3"
          value={formik.values.description}
          onChange={(value) => formik.setFieldValue("description", value)}
        />
        <div className="error">
          {formik.touched.description && formik.errors.description}
        </div>

        <div className="bg-white border-1 p-5 text-center mt-3">
          {imgUloading ? (
            <PacmanLoader color="green" />
          ) : (
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
          )}
        </div>
        <div className="showimages d-flex flex-wrap mt-3 gap-3">
          {img &&
            img.map((i, j) => (
              <div className="position-relative" key={j}>
                <button
                  type="button"
                  onClick={() => handleRemoveImg(i.public_id)} //dispatch(getABlog(getBlogId &&getBlogId))
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={i.url} alt="" width={200} height={200} />
              </div>
            ))}
        </div>
        <div className="showimages d-flex flex-wrap mt-3 gap-3">
          {images &&
            images.map((i, j) => (
              <div className="position-relative" key={j}>
                <button
                  type="button"
                  // onClick={() => handleRemoveImages(i.public_id)}
                  onClick={() => handleRemoveImages(i.public_id)}
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={i.url} alt="" width={200} height={200} />
              </div>
            ))}
        </div>

        <button className="btn btn-success border-0 rounded-3 my-5" type="submit">
          {getBlogId !== undefined ? "Edit" : "Add"} Blog
        </button>
      </form>
      <Bloglist />
    </div>
  );
};

export default Addblog;
