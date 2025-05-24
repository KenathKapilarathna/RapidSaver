/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getAllUsers } from "../../../config/UserFunctions";

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const grabUsers = async () => {
      try {
        if (data) {
          setUsers(data?.data || []);
        }
        setIsLoading(true);
        const res = await getAllUsers();
        setUsers(res);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    grabUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Primary Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Secondary Email",
      dataIndex: "email",
      key: "email2",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Title level={2}>User Management</Title>
      <Table
        loading={isLoading}
        dataSource={users}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default UserManagement;
