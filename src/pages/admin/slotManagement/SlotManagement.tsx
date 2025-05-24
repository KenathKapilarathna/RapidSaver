 
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  TimePicker,
  Typography,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addSlot,
  deleteSlot,
  getSlotsAsList,
} from "../../../config/SlotFunctions";
const { Title } = Typography;
const { Option } = Select;

interface Slot {
  date: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  startTime: string;
  endTime: string;
  id?: string;
}

const SlotManagement = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAllSlot = async () => {
      setIsLoading(true);
      const lst = await getSlotsAsList();
      setSlots(lst);
      setIsLoading(false);
    };
    getAllSlot();
  }, [form]);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async (values: Slot) => {
    try {
      const startTime = form.getFieldValue("startTime").format("HH:mm");
      const endTime = form.getFieldValue("endTime").format("HH:mm");
      const res = await addSlot({
        date: values.date,
        startTime: startTime,
        endTime: endTime,
      });
      message.success("Slot added successfully!");
      setSlots((prevSlots) => [
        ...prevSlots,
        {
          id: res.id,
          date: values.date,
          startTime: startTime,
          endTime: endTime,
        },
      ]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add the slot. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (index: number) => {
    const slotToRemove = slots[index];
    await deleteSlot(slotToRemove.date, slotToRemove.id!);
    const updatedSlots = [...slots];
    updatedSlots.splice(index, 1);
    setSlots(updatedSlots);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
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
      <Title level={2}>Slot Management</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Add Slot
      </Button>
      <Table dataSource={slots} columns={columns} rowKey="id" />

      <Modal
        title="Add Slot"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        loading={isLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select placeholder="Select a day">
              <Option value="mon">Monday</Option>
              <Option value="tue">Tuesday</Option>
              <Option value="wed">Wednesday</Option>
              <Option value="thu">Thursday</Option>
              <Option value="fri">Friday</Option>
              <Option value="sat">Saturday</Option>
              <Option value="sun">Sunday</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[
              { required: true, message: "Please select the start time!" },
            ]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please select the end time!" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SlotManagement;
