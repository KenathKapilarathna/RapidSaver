import React from "react";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { FaHistory, FaTruck } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";

const menuItems = [
  {
    key: "1",
    icon: <BsCalendarCheck />,
    label: <Link to="/driver/dupcomingbookings">Driver Future Bookings</Link>,
  },
  {
    key: "2",
    icon: <FaTruck />,
    label: <Link to="/driver/vehiclestatusdrive">Vehicle Status</Link>,
  },
  {
    key: "3",
    icon: <FaHistory />,
    label: <Link to="/driver/dpastbookings">Driver Past Bookings</Link>,
  },
  {
    key: "4",
    icon: <MdAccountCircle />,
    label: <Link to="/driver/driver-info">Driver Info</Link>,
  },
];

const DriverDashboard: React.FC = () => {
  return (
    <div className="mt-[62px]">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{
            height: "100vh",
            position: "sticky",
            left: 0,
            top: 0,
            zIndex: 1,
            backgroundColor: "rgb(0, 0, 0)",
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div
            style={{
              color: "white",
              textAlign: "center",
              height: "4rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 className="uppercase text-white">Driver Dashboard</h1>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            style={{ backgroundColor: "rgb(0, 0, 0)" }}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px 0", padding: 12 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default DriverDashboard;
