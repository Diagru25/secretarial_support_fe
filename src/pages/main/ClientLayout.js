import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import store from "./store";
import { useHookstate } from "@hookstate/core";

import authApi from "../../services/apis/auth";

export const PublicLayout = () => {
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
  
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};
