import React, { useState } from "react";
import { Menu, Button, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import store from "../../pages/main/store";
import { useHookstate } from "@hookstate/core";

export const Header = () => {
  const navigate = useNavigate();
  const state = useHookstate(store);
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

  const handleClickLogin = () => {
    navigate("/login");
  };

  const handleClickLogout = () => {
    try {
      //call api logout
      state.isLogged.set(false);
    } catch (ex) {
      return;
    }
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
        {state.isLogged.get() ? (
          <Space size="small">
            <Typography.Text>{state.user.get().name}</Typography.Text>
            <Button type="link" onClick={handleClickLogout}>
              (Đăng xuất)
            </Button>
          </Space>
        ) : (
          <Button type="link" onClick={handleClickLogin}>
            Đăng nhập
          </Button>
        )}
      </div>
    </div>
  );
};
