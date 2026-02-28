import ManagerLayout from "@/components/layouts/ManagerLayout";
import { AnalyticsPage } from "@/pages/manager/AnalyticsPage";
import ManagerBookingPage from "@/pages/manager/ManagerBookingPage";
import ManagerDashboardPage from "@/pages/manager/ManagerDashboardPage";
import ManagerRoomPage from "@/pages/manager/ManagerRoomPage";
import ManagerSchedulePage from "@/pages/manager/ManagerSchedulePage";
import { Route, Routes } from "react-router-dom";

const ManagerRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<ManagerLayout />}>
                <Route path="dashboard" element={<ManagerDashboardPage />} />
                <Route path="schedule" element={<ManagerSchedulePage />} />
                <Route path="rooms" element={<ManagerRoomPage />} />
                <Route path="bookings" element={<ManagerBookingPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
        </Routes>
    );
};

export default ManagerRoute;