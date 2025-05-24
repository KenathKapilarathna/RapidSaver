import { useEffect, useState } from "react";
import { Button, Input, Form, Avatar, message, Spin } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../redux/hooks";
import { db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateUser } from "../../../config/UserFunctions";


interface UserProfile {
  name: string;
  email: string;
  email2: string;
  phone: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  id: string;
  uid: string;
  userId: string;
  role: string;
  
}

const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState<string>("");
  const [email2, setEmail2] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setUserProfile(data);
          setName(data.name || "");
          setEmail2(data.email2 || "");
          setPhone(data.phone || "");

          // Delay setting form values until form is mounted
          if (isEditing) {
            form.setFieldsValue(data);
          }
        } else {
          message.error("Failed to load profile data");

          if (isEditing) {
            form.setFieldsValue({
              name: user.name || "",
              email: user.email || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, isEditing, form]); // <- include isEditing

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = async () => {
    if (!user?.id) {
      message.error("User not found");
      return;
    }
    if (!name || !email2 || !phone) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const results = await updateUser(user.id, {
        name: name,
        email2: email2,
        phone: phone,
      });

    
      message.success("Profile updated successfully!");
      setUserProfile({
        createdAt: results.createdAt,
        email: results.email,
        email2: results.email2,
        id: results.id,
        name: results.name,
        phone: results.phone,
        role: results.role,
        updatedAt: results.updatedAt,
        uid: results.uid,
        userId: results.userId,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      message.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(userProfile?.name || "");
    setEmail2(userProfile?.email2 || "");
    setPhone(userProfile?.phone || "");
  };

  if (!user) {
    return <div className="p-6">Please log in to view your profile.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex items-center mb-6">
        <Avatar size={64} icon={<UserOutlined />} />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">
            {userProfile?.name || user.name || "New User"}
          </h1>
          {!isEditing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="mt-2"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="email2"
            label="Secondary Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail2(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9\-+]{9,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              placeholder="Enter your phone number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>

          

          <div className="flex justify-end space-x-4">
            {<Button onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" htmlType="submit" loading={loading}>
              {"Save Changes"}
            </Button>
          </div>
        </Form>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Primary Email</h2>
            <p>{userProfile?.email || user.email || "Not provided"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Secondary Email</h2>
            <p>{userProfile?.email2 || "Not provided"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Phone</h2>
            <p>{userProfile?.phone || "Not provided"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Created At</h2>
            <p>
              {(userProfile?.createdAt &&
                new Date(userProfile.createdAt).toLocaleString()) ||
                "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Updated At</h2>
            <p>
              {(userProfile?.updatedAt &&
                new Date(userProfile.updatedAt).toLocaleString()) ||
                "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Role</h2>
            <p>{userProfile?.role || "Not provided"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
