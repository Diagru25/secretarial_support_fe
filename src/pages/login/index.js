import React from "react";
import {Form, Input, Typography, Button} from "antd";
import {useNavigate} from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        return navigate("/");
    }

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
      <div style={{width: "300px", textAlign: "center", transform: "translate(0, -50%)"}}>
        <Typography.Title level={4} style={{marginBottom: "1.5rem"}}>Đăng nhập</Typography.Title>
        <Form>
          <Form.Item>
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="password" />
          </Form.Item>
        </Form>
        <Button type="primary" style={{width: "100%"}} onClick={handleLogin}>Đăng nhập</Button>
      </div>
        
      </div>
    );
}