import "./App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import DashBoard from "./pages/dashboard/Dashboard";
import EventsList from "./pages/events/EventsList";
import EventDetails from "./pages/events/eventDetails";
import ExpenseList from "./pages/settlements/SettlementsList";
import SettlementsList from "./pages/settlements/SettlementsList";
import ExpenseDetails from "./pages/expenses/ExpenseDetails";
import Profile from "./pages/profile/Profile";
import ActivtiesList from "./pages/activities/ActivitiesList";
import EditProfile from "./pages/profile/EditProfile";
import FriendsList from "./pages/friends/FriendsList";
function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expense/:expenseId" element={<ExpenseDetails />} />
            <Route path="/friends" element={<FriendsList />} />
          </Route>
          <Route element={<Register />} path="/register" />
          <Route element={<Login />} path="/login" />
          <Route path="/settlements" element={<SettlementsList />} />
          <Route path="/activities" element={<ActivtiesList />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
