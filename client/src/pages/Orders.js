import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getMyDetails, getMyOrders, getOrders } from "../features/auth/authSlice";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { toast } from "react-toastify";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
    sorter: (a, b) => a.key.length - b.key.length,
  },
  {
    title: "Id",
    dataIndex: "id",
    sorter: (a, b) => a.id.length - b.id.length,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Product",
    dataIndex: "product",
    sorter: (a, b) => a.product.length - b.product.length,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    sorter: (a, b) => a.amount.length - b.amount.length,
  },
  {
    title: "Date",
    dataIndex: "date",
    sorter: (a, b) => a.date.length - b.date.length,
  },
  {
    title: "status",
    dataIndex: "status",
    render: (i, v) =>
      v.status === "Delivered" ? (
        <p style={{ color: "green" }}>{v.status}</p>
      ) : v.status === "Shipped" ? (
        <p style={{ color: "blue" }}>{v.status}</p>
      ) : (
        <p style={{ color: "red" }}>{v.status}</p>
      ),
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyDetails());
    if (user && (user.role === "admin" || user.role === "sub_admin")) {
      dispatch(getOrders());
    } else {
      dispatch(getMyOrders());
    }
    
  }, [dispatch]);
  const orderState = useSelector((state) => state.auth.orders);
  console.log(orderState)
  const AlertMessage = async (id) => {
    
        toast.warn("You cannot update");

        
    
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are You Sure Delete This Order?")) {
      const { data } = await axios.delete(`${base_url}order/${id}`, config);
      if (data.success) {
        toast.warn("Order deleted successfully");
        dispatch(getOrders());
      }
    }
  };
  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    const order = orderState[i];
    const isCurrentUserProduct =
      user && user._id.toString() === order?.user?._id.toString();
    let editLink=null;
   {user &&(user.role==="admin"||user.role==="sub_admin") ? editLink = (
      <Link to={`/admin/order/process/${order._id}`} className="fs-3 text-danger">
        <BiEdit />
      </Link>
    ): editLink = null}

    const deleteLink = (
      <Link
        className="ms-3 fs-3 text-danger"
        to={`#${order._id}`}
        onClick={() => handleDelete(order._id)}
      >
        <AiFillDelete />
      </Link>
    );

    const editDeleteLinks = (
      <>
        {user &&
        (user.role === "admin" || user.role === "sub_admin" || isCurrentUserProduct) ? (
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
          <span style={{color:"red"}}>You don't have permission to edit/delete</span>
        )}
      </>
    );
    data1.push({
      key: i + 1,
      name: orderState[i].user?.name,
      id: "..." + orderState[i]?._id.slice(20, 30),
      product: <Link to={`/admin/order/${orderState[i].user?._id}`}>View Orders</Link>,
      amount: orderState[i]?.totalPrice,
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      status: orderState[i]?.orderStatus,
      action: editDeleteLinks,
      // action: (
      //   <>
      //     <Link
      //       to={`/admin/order/process/${orderState[i]._id}`}
      //       className=" fs-3 text-danger"
      //     >
      //       <BiEdit />
      //     </Link>
      //     <Link
      //       className="ms-3 fs-3 text-danger"
      //       to={`#${orderState[i]._id}`}
      //       onClick={() => handleDelete(orderState[i]._id)}
      //     >
      //       <AiFillDelete />
      //     </Link>
      //   </>
      // ),
    });
  }
  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;
