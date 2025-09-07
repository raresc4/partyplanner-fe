import LoginPage from "./Pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import EventPage from "./Pages/EventPage";
import MainPage from "./Pages/MainPage";
import ProfilePage from "./Pages/ProfilePage";
import AboutPage from "./Pages/AboutPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLoggedUser } from "./Actions/user";
import { useNavigate, useLocation } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import "react-datepicker/dist/react-datepicker.css";

const queryClient = new QueryClient();

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const {
    data: loggedUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loggedUser"],
    queryFn: getLoggedUser,
    enabled: !isPublicRoute,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!isPublicRoute) {
    if (isLoading) {
      return <div></div>;
    }

    if (isError) {
      navigate("/login");
      return null;
    }
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={<ProfilePage loggedUser={loggedUser} />}
        />
        <Route
          path="/room/:name"
          element={<EventPage loggedUser={loggedUser} />}
        />
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
