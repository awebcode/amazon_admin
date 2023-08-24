import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(`${base_url}product/`,config);

  return response.data;
};
const getSingleProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`);
  
  return response.data;
};

const createProduct = async (product) => {
  const response = await axios.post(`${base_url}product/`, product, config);

  return response.data;
};
const updateProduct = async (product) => {
  const response = await axios.put(
    `${base_url}product/${product.id}`,
    product,
    config
  );

  return response.data;
};
const productService = {
  getProducts,
  createProduct,
  updateProduct,
  getSingleProduct
};

export default productService;
