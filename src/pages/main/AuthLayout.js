import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";

export const AuthLayout = () => {
    return (
      <div>
      <Header/>
        <Outlet />
      </div>
    );
}