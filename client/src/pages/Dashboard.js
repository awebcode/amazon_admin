import React, { useEffect } from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";
import { getProducts } from "../features/product/productSlice";
import { useNavigate } from "react-router-dom";
import { getMyDetails, getOrders } from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Status",
    dataIndex: "staus",
  },
];
const data1 = [];
for (let i = 0; i < 46; i++) {
  data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: 32,
    staus: `London, Park Lane no. ${i}`,
  });
}
const Dashboard = () => {
  const data = [
    {
      type: "Jan",
      sales: 38,
    },
    {
      type: "Feb",
      sales: 52,
    },
    {
      type: "Mar",
      sales: 61,
    },
    {
      type: "Apr",
      sales: 145,
    },
    {
      type: "May",
      sales: 48,
    },
    {
      type: "Jun",
      sales: 38,
    },
    {
      type: "July",
      sales: 38,
    },
    {
      type: "Aug",
      sales: 38,
    },
    {
      type: "Sept",
      sales: 38,
    },
    {
      type: "Oct",
      sales: 38,
    },
    {
      type: "Nov",
      sales: 38,
    },
    {
      type: "Dec",
      sales: 38,
    },
  ];
  const config = {
    data,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#10b981";
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Income",
      },
    },
  };
  //
  const navigate=useNavigate()
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyDetails())
    dispatch(getUsers());
    dispatch(getProducts())
    dispatch(getOrders())
  }, [dispatch]);
  const customerstate = useSelector((state) => state.customer.customers);
  const productState = useSelector((state) => state.product.products);
  const orderState = useSelector((state) => state.auth.orders);
  return (
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total Assests</p>
            <h4 className="mb-0 sub-title">$111100</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              <BsArrowDownRight /> 32%
            </h6>
            <p className="mb-0  desc">Compared To April 2023</p>
          </div>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/customers")}
          className=" d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3"
        >
          <div>
            <p className="desc">Users</p>
            <h4 className="mb-0 sub-title">{customerstate.length}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="red">
              <BsArrowDownRight /> 52%
            </h6>
            <p className="mb-0  desc">Compared To April 2023</p>
          </div>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/list-product")}
          className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3"
        >
          <div>
            <p className="desc">Products</p>
            <h4 className="mb-0 sub-title">{productState.length}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <BsArrowDownRight /> 82%
            </h6>
            <p className="mb-0 desc">Compared To April 2022</p>
          </div>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/orders")}
          className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3"
        >
          <div>
            <p className="desc">Orders</p>
            <h4 className="mb-0 sub-title">{orderState.length}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <BsArrowDownRight /> 92%
            </h6>
            <p className="mb-0 desc">Compared To June 2023</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-5 title">Income Statics</h3>
        <div>
          <Column {...config} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Recent Orders</h3>
        <div>
          <Table columns={columns} dataSource={data1} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
