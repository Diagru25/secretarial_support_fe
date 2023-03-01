import React, { useState } from "react";
import { Form, Input, Typography, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import authApi from "../../services/apis/auth";
import { useHookstate } from "@hookstate/core";
import store from "../main/store";

export const LoginPage = () => {
  const authState = useHookstate(store);

  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    try {
      await authApi.login(dataLogin);
      const res = await authApi.getCurrentUser();
      authState.set({
        isLogged: true,
        user: {...res.data.result}
      });
      message.success("Đăng nhập thành công.");
      return navigate("/");
    } catch (ex) {
        message.error(ex.response.data.message);
        return;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "300px",
          textAlign: "center",
          transform: "translate(0, -50%)",
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: "1.5rem" }}>
          Đăng nhập
        </Typography.Title>
        <Form>
          <Form.Item>
            <Input
              placeholder="Tên đăng nhập"
              value={dataLogin.username}
              onChange={(e) =>
                setDataLogin({ ...dataLogin, username: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              placeholder="Mật khẩu"
              value={dataLogin.password}
              onChange={(e) =>
                setDataLogin({ ...dataLogin, password: e.target.value })
              }
            />
          </Form.Item>
        </Form>
        <Button type="primary" style={{ width: "100%" }} onClick={handleLogin}>
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};
