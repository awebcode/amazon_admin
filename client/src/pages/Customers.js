import React, { useEffect } from "react";
import { Avatar, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";
import { BiCommentEdit, BiEdit } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import axios from "axios";
import { getMyDetails } from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
    sorter: (a, b) => a.key.length - b.key.length,
  },
  {
    title: "UserId",
    dataIndex: "id",
    sorter: (a, b) => a.id.length - b.id.length,
  },
  {
    title: "Avatar",
    dataIndex: "avatar",
    render: (text, redcord) => <Avatar src={redcord?.avatar?.url} />,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => a.email.length - b.email.length,
  },
  {
    title: "User role",
    dataIndex: "role",
    sorter: (a, b) => a.role.length - b.role.length,
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    sorter: (a, b) => a.mobile.length - b.mobile.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Customers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyDetails())
    dispatch(getUsers());
  }, []);
  const customerstate = useSelector((state) => state.customer.customers);
   const handleDelete = async (id) => {
     if (window.confirm("Are You Sure Delete This User?")) {
       const { data } = await axios.delete(`${base_url}user/delete/${id}`, config);
       if (data.success) {
         toast.warn(data.message);

         dispatch(getUsers());
       }
     }
   };
  const data1 = [];
  for (let i = 0; i < customerstate.length; i++) {
    if (customerstate[i].role !== "admin" || customerstate[i].role === "admin") {
      data1.push({
        key: i + 1,
        id:"..."+ customerstate[i]._id.slice(20,30),
        avatar: customerstate[i].avatar,
        name: customerstate[i].name,
        role: customerstate[i].role, //" " + customerstate[i].lastname,
        email: customerstate[i].email,
        mobile: customerstate[i].phone,
        action: (
          <>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Link
                to={`/admin/user/update/role/${customerstate[i]._id}`}
                className=" fs-8 text-danger"
              >
                role
              </Link>

              <Link
                className="ms-3 fs-8 text-danger"
                to={`#${customerstate[i]._id}`}
                onClick={() => handleDelete(customerstate[i]._id)}
              >
                delete
              </Link>
              <Link
                to={`/admin/user/update/${customerstate[i]._id}`}
                className="ms-2 fs-8 text-danger"
              >
                edit user
              </Link>
            </div>
          </>
        ),
      });
    }
  }

  return (
    <div>
      <h3 className="mb-4 title">Customers({customerstate && customerstate.length})</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Customers;
