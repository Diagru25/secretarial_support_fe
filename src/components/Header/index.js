import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

export const Header = () => {
  const [current, setCurrent] = useState("app");
  const items = [
    {
      label: <Link to="/">Trang chủ</Link>,
      key: "app",
    },
    {
      label: <Link to="/meeting/list">DS cuộc họp</Link>,
      key: "meeting",
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "64px",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 1.5rem",
      }}
    >
      <div>
        <Menu
          style={{ border: "none" }}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
      <div>
        <Link to="/login" style={{textDecoration: "none"}}>Đăng nhập</Link>
      </div>
    </div>
  );
};
