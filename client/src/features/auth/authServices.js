import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";
const login = async (user) => {
  const response = await axios.post(`${base_url}user/admin-login`, user, config);
  
  return response.data;
};
const logout = async () => {
  const response = await axios.get(`${base_url}user/logout`, {
    headers:{
      "Content-Type":"application/json"
  },
    withCredentials: "true",
    
  });
  if (response.data) {
    localStorage.removeItem("user");
  }
  return response.data;
};
const getMyDetails= async () => {
  const response = await axios.get(`${base_url}user/single`, config);
 
  return response.data;
};
const getOrders = async () => {
  const response = await axios.get(`${base_url}user/getallorders`, config);

  return response.data;
};
const getMyOrders = async () => {
  const response = await axios.get(`${base_url}user/getMyOrders`, config);

  return response.data;
};
const getOrder = async (id) => {
  const response = await axios.post(
    `${base_url}user/getorderbyuser/${id}`,
    "",
    config
  );

  return response.data;
};

const authService = {
  login,
  logout,
  getMyDetails,
  getOrders,
  getOrder,
  getMyOrders
};

export default authService;
