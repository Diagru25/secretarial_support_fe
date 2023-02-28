import react from "react";
import { Route, Routes } from "react-router-dom";
import { MeetingPage } from "../meetting";
import RecorderPage from "../recorder";
import { AuthLayout } from "./AuthLayout";
import { PublicLayout } from "./ClientLayout";

export const App = () => {
    return (
      <Routes>
        <Route element={<PublicLayout/>}>
            <Route path="/" element={<RecorderPage/>}/>
        </Route>
        <Route element={<AuthLayout />}>
            <Route path="/meeting/list" element={<MeetingPage/>}/>
        </Route>
      </Routes>
    );
}