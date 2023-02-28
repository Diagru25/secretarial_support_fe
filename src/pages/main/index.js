import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../login";
import { MeetingPage } from "../meetting";
import RecorderPage from "../recorder";
import { AuthLayout } from "./AuthLayout";
import { PublicLayout } from "./ClientLayout";

export const App = () => {
    return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<RecorderPage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/meeting/list" element={<MeetingPage />} />
          </Route>
        </Routes>
    );
}