import React, { useEffect, useState } from "react";
import { Avatar, Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { toast } from "react-toastify";
import { config } from "../utils/axiosconfig";
import { PacmanLoader } from "react-spinners";
import { getMyDetails } from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Product",
    dataIndex: "image",
    render: (text, redcord) => <Avatar src={redcord?.image[0]?.url} />, //<Avatar src={redcord[1]?.url} />
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.slice(1, 50),
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },

  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Avatar",
    dataIndex: "avatar",
    render: (text, redcord) => <Avatar src={redcord?.avatar?.url} />, //<Avatar src={redcord[1]?.url} />
  },
  {
    title: "Creator",
    dataIndex: "creator",
    sorter: (a, b) => a.creator - b.creator,
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const dispatch = useDispatch();
  const { products: productState } = useSelector((state) => state.product);
  const [isLoading,setIsloading]=useState(false)
  useEffect(() => {
    dispatch(getMyDetails())
    setIsloading(true);
    dispatch(getProducts());
    setTimeout(() => {

      setIsloading(false)
    }, 1000);
    
    // setIsloading(false)
  }, [dispatch,isLoading]);
   
  // const productState = useSelector((state) => state.product.products);
   const { user } = useSelector((state) => state.auth);
  const handleDelete = async (id) => {
    
      if (window.confirm("Are You Sure Delete This Product?")) {
        const { data } = await axios.delete(`${base_url}product/${id}`, config);
        if (data.success) {
          toast.warn("Product deleted successfully");
          dispatch(getProducts());
        }
      }
    
  };

  // const updateAlert = (id) => {
  //   if (user) {
  //     if (user._id.toString() !== id.toString()) {
  //       toast.warning("This is not your own product.");
  //     } else if (user.role !== "admin" || user.role !== "sub_admin") {
  //       toast.warning("only admin or sub_admin can update");
  //     } else {
  //       toast.warning("You don't have permission to edit this product.");
  //     }
  //   }
  // };
  // console.log("product state",productState)
  const data1 = [];
  for (let i = 0; i < productState?.length; i++) {
     const product = productState[i];
     const isCurrentUserProduct =
       user && user._id.toString() === product?.user?._id.toString();
 
     const editLink = (
       <Link to={`/admin/product/${product._id}`} className="fs-3 text-danger">
         <BiEdit />
       </Link>
     );

     const deleteLink = (
       <Link
         className="ms-3 fs-3 text-danger"
         to={`#${product._id}`}
         onClick={() => handleDelete(product._id)}
       >
         <AiFillDelete />
       </Link>
     );

     const editDeleteLinks = (
       <>
         {user && (user.role === "admin" || user.role === "sub_admin" ||isCurrentUserProduct) ? (
           isCurrentUserProduct ? (
             <>
               {editLink}
               {deleteLink}
             </>
           ) : (
             <>
               
               {editLink}
               {deleteLink}
             </>
           )
         ) : (
           <span>You don't have permission to edit/delete</span>
         )}
       </>
     );
    data1.push({
      key: i + 1,
      id: "..." + productState[i]._id.slice(20, 30),
      title: productState[i].title.slice(1, 20) + "...",
      image: productState[i].images,
      brand: productState[i].brand,
      category: productState[i].category,
      // color: productState[i].color.slice(1, 2) + "...",
      price: `${productState[i].price}`,
      avatar: productState[i]?.user?.avatar,
      creator: productState[i]?.user?.name,
      action:editDeleteLinks
      // action: (
      //   <>
      //     {user && user.role !== "admin" ? (
      //       <Link onClick={() => updateAlert(productState[i]?.user?._id)} className=" fs-3 text-danger">
      //         <BiEdit />
      //       </Link>
      //     ) : (
      //       <Link
      //         to={`/admin/product/${productState[i]._id}`}
      //         className=" fs-3 text-danger"
      //       >
      //         <BiEdit />
      //       </Link>
      //     )}
      //     <Link
      //       className="ms-3 fs-3 text-danger"
      //       to={`#${productState[i]._id}`}
      //       onClick={() => handleDelete(productState[i]._id)}
      //     >
      //       <AiFillDelete />
      //     </Link>
      //   </>
      // ),
    });
  }
  
  return (
    <>
      {isLoading ? (
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <PacmanLoader color="green" />
        </div>
      ) : (
        <div>
          <h3 className="mb-4 title">Products({productState?.length})</h3>
          <div>
            <Table columns={columns} dataSource={data1} />
          </div>
        </div>
      )}
    </>
  );
};

export default Productlist;
