import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const AuthLayout = () => {
    return (
      <div>
        <Outlet />
      </div>
    );
}