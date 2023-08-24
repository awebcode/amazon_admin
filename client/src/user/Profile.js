import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { Card, Avatar, Upload, Button, Input } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { upload } from "../utils/upload";
import { PacmanLoader } from "react-spinners";
import { getMyDetails } from "../features/auth/authSlice";

const CustomInput = ({ label, value, onChange, disabled, placeholder }) => (
  <div className="custom-input">
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);
 
const Profile = () => {
  const history = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
const dispatch=useDispatch()
 useEffect(() => {
   dispatch(getMyDetails());
 }, [dispatch]);
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get(`${base_url}user/single`, config, {
          withCredentials:true
        });

        if (response.status === 200) {
            const userData = response.data.user;
        //   console.log(userData)
          setName(userData.name);
          setEmail(userData.email);
            setPhone(userData.phone || "");
            
          if (userData.avatar) {
            setAvatarPreview(userData.avatar?.url);
          }
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
      }
    }
    fetchUserDetails();
  }, []);

  const handleAvatarChange = (info) => {
     setAvatarLoading(true)
      setAvatarFile(info.file);
      setAvatarPreview(URL.createObjectURL(info.file));
    
      setAvatarLoading(false)
  };

  
   

  const handleUpdateProfile = async () => {
    setLoading(true);
      try {
          setAvatarLoading(true)
          const avatarData = avatarFile ? await upload(avatarFile) : null;
          setAvatarLoading(false)
      const updateUserPayload = {
        name: name,
        email: email,
        phone: phone,
          password: password,
          avatar: avatarData
      };

      const response = await axios.put(
        `${base_url}user/update/me`,
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
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
    };
    const navigate = useNavigate();
    const authState = useSelector((state) => state);

    const { user } = authState.auth;

    

  return (
    <div className="profile-container">
      <Card className="profile-card">
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
        <div className="profile-form">
          <CustomInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomInput label="Email" value={email} disabled />
          <CustomInput
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {/* <Input.Password
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            visibilityToggle={true}
          /> */}
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>Change Avatar</Button>
          </Upload>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={handleUpdateProfile}
          >
            Update Profile
          </Button>
        </div>

        <div className="d-flex flex-column">
          <Link to="update-password">update password?</Link>
          <Link to="forget-password">forget password?</Link>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
