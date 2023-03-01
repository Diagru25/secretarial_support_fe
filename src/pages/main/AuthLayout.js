import { useHookstate } from "@hookstate/core";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import authApi from "../../services/apis/auth";
import store from "./store";

export const AuthLayout = () => {
  const navigate = useNavigate();
const authState = useHookstate(store);

  useEffect(() => {
    handleCheckToken();
  }, []);

  const handleCheckToken = async () => {
    try {
      await authApi.checkToken();
      const res = await authApi.getCurrentUser();
      authState.set({
        isLogged: true,
        user: { ...res.data.result },
      });
    } catch (error) {
      authState.isLogged.set(false);
    }
  };

  if (!authState.isLogged.get()) {
    return navigate("/login");
  }

  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: "1440px",
          margin: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
