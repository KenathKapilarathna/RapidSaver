import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Table } from "antd";
import { getDrivers, registerDriver } from "../../../config/DriverFunctions";

interface Driver {
  driverId: string;
  driverName: string;
  staffId: string;
  licenceNo: string;
  phoneNo: string;
  driverEmail: string;
  driverPassword: string;
}

const DriverManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversData = await getDrivers();
      if (driversData) {
        const formattedDrivers = Object.keys(driversData).map((key) => ({
          driverId: key.substring(0, 5),
          driverName: driversData[key].name,
          staffId: driversData[key].staffId,
          licenceNo: driversData[key].licenceNo,
          phoneNo: driversData[key].phone,
          driverEmail: driversData[key].email,
          driverPassword: driversData[key].password,
          ...driversData[key],
        }));
        setDrivers(formattedDrivers);
      }
    };
    fetchDrivers();
    
  }, []);

  const handleAddDriver = async (values: Driver) => {
    const driverData = await registerDriver({
      name: values.driverName,
      email: values.driverEmail,
      phone: values.phoneNo,
      staffId: values.staffId,
      licenceNo: values.licenceNo,
      password: values.driverPassword,
    });
    console.log(driverData);
    const filtered = {
      driverId: driverData.uid.substring(0, 5),
      driverName: driverData.name,
      staffId: driverData.staffId,
      licenceNo: driverData.licenceNo,
      phoneNo: driverData.phone,
      driverEmail: driverData.email,
      driverPassword: driverData.password,
    };
    setDrivers([...drivers, filtered]);
    form.resetFields();
    setIsModalOpen(false);
  };



  const columns = [
    { title: "Driver UID", dataIndex: "driverId", key: "driverId" },
    { title: "Driver Name", dataIndex: "driverName", key: "driverName" },
    { title: "Staff ID", dataIndex: "staffId", key: "staffId" },
    { title: "Licence No", dataIndex: "licenceNo", key: "licenceNo" },
    { title: "Phone No", dataIndex: "phoneNo", key: "phoneNo" },
    { title: "Email", dataIndex: "driverEmail", key: "driverEmail" },
    { title: "Password", dataIndex: "driverPassword", key: "driverPassword" },
    
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Driver Management</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        + Add Driver
      </Button>

      <Table
        className="mt-4"
        dataSource={drivers.map((item, idx) => ({ ...item, key: idx }))}
        columns={columns}
      />

      <Modal
        title="Add Driver"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical" 
          onFinish={handleAddDriver}
          requiredMark="optional"
        >
          <Form.Item
            label="* Driver Name"
            name="driverName"
            rules={[{ required: true, message: "Please enter Driver Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="* Driver Email"
            name="driverEmail"
            rules={[{ required: true, message: "Please enter Driver ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="* Driver Password"
            name="driverPassword"
            rules={[{ required: true, message: "Please enter Driver ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="* Staff ID"
            name="staffId"
            rules={[{ required: true, message: "Please enter Staff ID" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="* Driving Licence No"
            name="licenceNo"
            rules={[{ required: true, message: "Please enter Licence Number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="* Phone No"
            name="phoneNo"
            rules={[{ required: true, message: "Please enter Phone Number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              OK
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DriverManagement;
