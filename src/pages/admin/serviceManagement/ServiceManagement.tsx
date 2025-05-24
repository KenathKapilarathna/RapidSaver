 
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import {
  addService,
  deleteService,
  getServicesAsList,
} from "../../../config/ServiceFunctions";

const { Title } = Typography;

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  pic: string;
}

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllService = async () => {
      setIsLoading(true);
      const lst = await getServicesAsList();
      setServices(lst);
      setIsLoading(false);
    };
    getAllService();
  }, [form]);

  const showModal = (
    editMode: boolean = false,
    service: Service | null = null
  ) => {
    setIsEditMode(editMode);
    if (editMode && service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async (values: Service) => {
    try {
      const res = await addService({
        name: values.name,
        description: values.description,
        price: values.price,
        duration: values.duration,
        pic: values.pic,
      });
      message.success("Service added successfully!");
      setServices((prevServices) => [
        ...prevServices,
        {
          id: res.id,
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          pic: values.pic,
        },
      ]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add the service. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleDelete = async (index: number) => {
    const serviceToRemove = services[index];
    await deleteService(serviceToRemove.id as string);
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price (LKR)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Picture",
      dataIndex: "pic",
      key: "pic",
      render: (pic: string) => (
        <img
          src={pic}
          alt="Service pic"
          style={{ width: 150, height: 75, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Action",
      render: (_: unknown, __: unknown, index: number) => (
        <Button danger onClick={() => handleDelete(index)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Title level={2}>Service Management</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Service
      </Button>
      <Table
        dataSource={services.map((service, index) => ({
          ...service,
          key: service.id || index.toString(),
        }))}
        columns={columns}
        rowKey="key"
      />

      <Modal
        title={isEditMode ? "Edit Service" : "Add Service"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        loading={isLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="pic"
            label="Service Picture (URL)"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (LKR)"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (min)"
            rules={[{ required: true, message: "Please input the duration!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
