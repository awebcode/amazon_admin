import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createCategory,
  getAProductCategory,
  getCategories,

  resetState,
  updateAProductCategory,
} from "../features/pcategory/pcategorySlice";
import { getMyDetails } from "../features/auth/authSlice";
import Categorylist from "./Categorylist";
let schema = yup.object().shape({
  title: yup.string().required("Category Name is Required"),
});
const Addcat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];
  const navigate = useNavigate();
  const newCategory = useSelector((state) => state.pCategory);
  const {
    isSuccess,
    isError,
    isLoading,
    createdCategory,
    categoryName,
    updatedCategory,
  } = newCategory;
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(getMyDetails());
    dispatch(getCategories())
    // dispatch(getCat());

    if (getPCatId !== undefined) {
      dispatch(getAProductCategory(getPCatId));
    } else {
      //  dispatch(resetState());
    }
  }, [dispatch,getPCatId]);
  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Category Added Successfullly!");
    }
    if (isSuccess && updatedCategory) {
      toast.success("Category Updated Successfullly!");
      navigate("/admin/category");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const createCategoryHandler = (e) => {
    dispatch(createCategory(e));

    // toast.success("Category Added Successfullly!");
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getPCatId !== undefined) {
        const data = { id: getPCatId, pCatData: values };
        dispatch(updateAProductCategory(data));
        dispatch(resetState());
      } else {
        // dispatch(createCategory(values));
        createCategoryHandler(values)
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
           dispatch(getCategories());
        }, 100);
      }
    },
  });
  return (
    <div>
      <h3 className="mb-4  title">
        {getPCatId !== undefined ? "Edit" : "Add"} Category
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Enter Product Category"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            id="brand"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getPCatId !== undefined ? "Edit" : "Add"} Category
          </button>
        </form>
      </div>
      <Categorylist/>
    </div>
  );
};

export default Addcat;
