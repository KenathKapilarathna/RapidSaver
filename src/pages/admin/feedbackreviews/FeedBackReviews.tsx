/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getReviews } from "../../../config/ReviewFunctions";

const { Title } = Typography;

const FeedBackReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const grabUsers = async () => {
      try {
        setIsLoading(true);
        const res = await getReviews();
        setReviews(res);
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
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Sentiment",
      dataIndex: "sentiment",
      key: "sentiment",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <Title level={2}>Feedback Reviews</Title>
      <Table
        loading={isLoading}
        dataSource={reviews}
        columns={columns}
        rowKey="rid"
      />
    </div>
  );
};

export default FeedBackReviews;
