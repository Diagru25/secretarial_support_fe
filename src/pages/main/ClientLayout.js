import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
