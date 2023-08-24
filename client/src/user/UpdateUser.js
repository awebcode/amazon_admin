import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import "./update.css";
import { upload } from "../utils/upload";
import { Avatar, Input, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { PacmanLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { getMyDetails } from "../features/auth/authSlice";
const UpdateUser = () => {
  const { id: userId } = useParams();
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get(`${base_url}user/single/${userId}`, config);

        if (response.status === 200) {
          const userData = response.data.user;

          setInitialValues({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
          });
            if (userData.avatar) {
              setAvatarPreview(userData.avatar?.url);
            }
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
      }
    }
    fetchUserDetails();
  }, [userId]);

    const handleAvatarChange = (info) => {
       setAvatarLoading(true);
     setAvatarFile(info.file);
     setAvatarPreview(URL.createObjectURL(info.file));

     setAvatarLoading(false);
   };


  
const handleUpdateUser = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  setLoading(true);
    try {
        setAvatarLoading(true)
        const avatarData = avatarFile ? await upload(avatarFile) : null;
        setAvatarLoading(false)
      const updateUserPayload = {
      name: initialValues.name,
      email: initialValues.email,
      password: initialValues.password,
        phone: initialValues.phone,
      avatar:avatarData
    };

    const response = await axios.put(
      `${base_url}user/update/${userId}`,
      updateUserPayload,
      config
    );

    if (response.status === 200) {
      toast.success("User updated successfully!");
      history("/admin/customers");
    } else {
      toast.error("Failed to update user");
    }
  } catch (error) {
    toast.error("An error occurred while updating user");
  } finally {
    setLoading(false);
  }
};
const dispatch = useDispatch();
useEffect(() => {
  dispatch(getMyDetails());
}, [dispatch]);
  return (
    <div className="update-user-container">
      <h2>Update User</h2>
      <form onSubmit={handleUpdateUser} className="update-user-form">
        <div className="update-user-label">Name</div>
        <input
          type="text"
          name="name"
          value={initialValues.name}
          onChange={(e) => setInitialValues({ ...initialValues, name: e.target.value })}
          className="update-user-input"
        />

        <div className="update-user-label">Email</div>
        <input
          type="email"
          name="email"
          value={initialValues.email}
          onChange={(e) => setInitialValues({ ...initialValues, email: e.target.value })}
          className="update-user-input"
        />

        {/* <div className="update-user-label">Password</div> */}
        {/* <Input.Password
          type="password"
          name="password"
          value={initialValues.password}
          onChange={(e) =>
            setInitialValues({ ...initialValues, password: e.target.value })
          }
          className="update-user-input"
          visibilityToggle={true}
        /> */}

        <div className="update-user-label">Phone</div>
        <input
          type="tel"
          name="phone"
          value={initialValues.phone}
          onChange={(e) => setInitialValues({ ...initialValues, phone: e.target.value })}
          className="update-user-input"
        />

        <div className="profile-avatar-upload">
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleAvatarChange}
          >
            {avatarLoading ? (
              <>
                <PacmanLoader color="green" />
              </>
            ) : (
              <>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="profile-avatar" />
                ) : (
                  <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
                )}
              </>
            )}
          </Upload>
        </div>

        <button type="submit" className="update-user-button" disabled={loading}>
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
