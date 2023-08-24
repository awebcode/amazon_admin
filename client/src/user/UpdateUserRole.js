import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import "./updateRole.css";
import { getMyDetails } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const UpdateUserRole = () => {
  const { id: userId } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [initialRole, setInitialRole] = useState("");

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get(`${base_url}user/single/${userId}`, config);

        if (response.status === 200) {
          const userData = response.data.user;
          setRole(userData.role);
          setInitialRole(userData.role);
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
      }
    }
    fetchUserDetails();
  }, [userId]);

  const handleUpdateUserRole = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${base_url}user/update/role/${userId}`,
        {
          role: initialRole, // Use initialRole instead of values.role
        },
        config
      );

      if (response.status === 200) {
        console.log(response.data);
        toast.success(response.data.message);
        history("/admin/customers"); // Navigate to the user list page
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
const dispatch = useDispatch();
useEffect(() => {
  dispatch(getMyDetails());
}, [dispatch]);
  return (
    <div className="update-user-role-container">
      <h2 className="update-user-role-title">
        Update User Role <span style={{ color: "green" }}>{role}</span>
      </h2>
      <div className="update-user-role-form">
        <label className="update-user-role-label">Select Role</label>
        <select
          className="update-user-role-select"
          value={initialRole}
          onChange={(e) => setInitialRole(e.target.value)}
        >
          {initialRole ? (
            <option value="">{initialRole}</option>
          ) : (
            <option value="">Please select a role</option>
          )}
          <option value="admin">Admin</option>
          <option value="sub_admin">Sub Admin</option>
          <option value="user">User</option>
          <option value="banned">Banned</option>
          <option value="public">Public</option>
        </select>
        <button
          className="update-user-role-button"
          type="button"
          onClick={handleUpdateUserRole}
          disabled={loading}
        >
          Update Role
        </button>
      </div>
    </div>
  );
};

export default UpdateUserRole;
