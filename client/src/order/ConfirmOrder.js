import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Row, Spin, Typography } from "antd";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { getMyDetails, getOrders } from "../features/auth/authSlice";
import "./confirm.css"
import moment from "moment"
const { Text } = Typography;

const ConfirmOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
useEffect(() => {
dispatch(getMyDetails())
}, [dispatch])

  const getSingleOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${base_url}user/single-order/${id}`, config);
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setLoading(true);
      await axios.put(`${base_url}user/order/${id}`, { status }, config);
      // Assuming you dispatch an action to update orders here

      getSingleOrder();
      // Show a success message to the user
      console.log("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleOrder();
  }, []);
  console.log(order);
  return (
    <div className="confirm-order-container">
      {loading ? (
        <Spin size="large" />
      ) : order ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Card title="Order Details">
              {order.orderItems.map((item, index) => (
                <div className="order-item" key={index}>
                  <p>
                    <strong>Product Name:</strong> {item.title.slice(0, 60) + "..."}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <img
                    style={{ height: "80px", width: "80px", borderRadius: "10px" }}
                    src={item.images[0]?.url}
                    alt=""
                  />
                </div>
              ))}

              <p className={`order-status ${order.orderStatus.toLowerCase()}-status`}>
                <strong style={{ color: "black" }}>Status:</strong> {order.orderStatus}
              </p>

              {order.deliveredAt && (
                <p>
                  {" "}
                  DeliveredAt:{" "}
                  <strong style={{ color: "green" }}>
                    {moment(order.deliveredAt).format("LLLL")}
                  </strong>
                </p>
              )}
            </Card>
          </Col>
          <Col xs={16} sm={16} md={10}>
            {order.orderStatus === "Processing" ? (
              <>
                <Card title="Confirmation">
                  {/* Only show the Ship button if the order is Delivered */}
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      updateStatus("Shipped");
                    }}
                    style={{
                      backgroundColor: "#FF5733",
                      borderColor: "#FF5733",
                      color: "#FFFFFF",
                    }}
                  >
                    Complete Shipping
                  </Button>
                </Card>
              </>
            ) : order.orderStatus === "Shipped" ? (
              <>
                <Card title="Confirmation">
                  {/* Only show the Deliver button if the order is Shipped */}
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      updateStatus("Delivered");
                    }}
                  >
                    Deliver
                  </Button>
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      updateStatus("Processing");
                    }}
                    style={{
                      backgroundColor: "#FF5733",
                      borderColor: "#FF5733",
                      color: "#FFFFFF",
                      margin: "10px 0px",
                    }}
                  >
                    Return Processing
                  </Button>
                </Card>
              </>
            ) : order.orderStatus === "Delivered" ? (
              /* Handle Processing status */
              <>
                <h2
                  style={{
                    backgroundColor: "#FF5733",
                    borderColor: "#FF5733",
                    color: "#FFFFFF",
                  }}
                >
                  Order Placed Successfully
                </h2>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    updateStatus("Shipped");
                  }}
                  style={{
                   
                    
                    color: "#FFFFFF",
                  }}
                >
                  Not delivered? back to shipping.
                </Button>
                {/* Add your desired content or components here for Processing status */}
              </>
            ) : null}
          </Col>
        </Row>
      ) : (
        <Text strong>Order not found.</Text>
      )}
    </div>
  );
};


export default ConfirmOrder;
