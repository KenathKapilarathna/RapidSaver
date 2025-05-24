/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Input, Form, Avatar, message } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../redux/hooks";
import { getDriver, updateDriver } from "../../../config/DriverFunctions";

const DriverInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const driver = useAppSelector((state: RootState) => state.auth.user);
  const [driverData, setDriverData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDriverData = async () => {
      if (driver) {
        // console.log(driver);
        const driverData = await getDriver(driver.id);
        if (driverData) {
          setDriverData(driverData);
          form.setFieldsValue({
            name: driverData.name,
            email: driverData.email,
            email2: driverData.email2,
            phone: driverData.phone,
            staffId: driverData.staffId,
            address: driverData.address || "",
            licenceNo: driverData.licenceNo || "",
          });
        }
      }
    };
    getDriverData();
  }, [driver, form]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = async (values: any) => {
    if (!driver) return;
    setIsLoading(true);
    try {
      const res = await updateDriver(driver.id, {
        name: values.name,
        email2: values.email2,
        phone: values.phone,
        address: values.address,
      });
      setDriverData({
        name: res.name,
        email2: res.email2,
        phone: res.phone,
        address: res.address,
        staffId: res.staffId,
        licenceNo: res.licenceNo,
        role: res.role,
        uid: res.uid,
        userId: res.userId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      });
      message.success("Driver profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      message.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (!driver) {
    return <p>Loading driver data...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex items-center mb-6">
        <Avatar size={64} icon={<UserOutlined />} />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{driver.name}</h1>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="mt-2"
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={driver}
          onFinish={handleFormSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the driver's name" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email2"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input placeholder="Enter address" />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save Changes
            </Button>
          </div>
        </Form>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Primary Email</h2>
            <p>{driver.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Secondary Email</h2>
            <p>{driverData && driverData.email2}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Phone</h2>
            <p>{driverData && driverData.phone}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Address</h2>
            <p>{driverData && driverData.address}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Driver ID</h2>
            <p>{driverData && driverData.uid}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Staff ID</h2>
            <p>{driverData && driverData.staffId}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Licence No</h2>
            <p>{driverData && driverData.licenceNo}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Role</h2>
            <p>{driverData && driverData.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverInfo;
