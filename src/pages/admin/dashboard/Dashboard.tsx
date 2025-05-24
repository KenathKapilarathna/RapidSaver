import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { BsFillCalendarFill } from "react-icons/bs";
import { GrUnorderedList } from "react-icons/gr";
import {
  MdCreateNewFolder,
  MdHistory,
  MdManageAccounts,
  MdManageHistory,
  MdOutlineDirectionsCar,
  MdReviews,
} from "react-icons/md";
import { Link, Outlet } from "react-router-dom";

const menuItems = [
  {
    key: "1",
    icon: <GrUnorderedList />,
    label: <Link to="/admin/all-bookings">Recent Bookings</Link>,
  },
  {
    key: "2",
    icon: <MdManageHistory />,
    label: <Link to="/admin/vehiclestatusup">Vehicle Status</Link>,
   
  },
  {
    key: "3",
    icon: <MdCreateNewFolder />,
    label: <Link to="/admin/services-management">Service Management</Link>,
    
  },
  {
    key: "4",
    icon: <BsFillCalendarFill />,
    label: <Link to="/admin/slots-management">Slot Management</Link>,
    
  },
  {
    key: "5",
    icon: <MdOutlineDirectionsCar />,
    label: <Link to="/admin/add-drivers">Add Drivers</Link>,
  },
  {
    key: "6",
    icon: <MdManageAccounts />,
    label: <Link to="/admin/users-management">User Management</Link>,
  },
  {
    key: "7",
    icon: <MdHistory />,
    label: <Link to="/admin/apast-bookings">Past Bookings</Link>,
  },
  {
    key: "8",
    icon: <MdReviews />,
    label: <Link to="/admin/feedback-reviews">Feedback Reviews</Link>,
  },
];

const Dashboard = () => {
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
          onBreakpoint={() => {}}
          onCollapse={() => {}}
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
            <h1 className="uppercase">Admin Dashboard</h1>
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

export default Dashboard;
