// App.js
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import store from "./store";
import Dashboard from "./components/dashboard/Dashboard";
import Workers from "./components/worker/Workers.js";
import WorkerBills from "./components/worker/WorkerBills";
import Shops from "./components/shop/Shops";
import ShopBills from "./components/shop/ShopBills";
import ProjectsPage from "./components/projects/ProjectsPage";
import { LOGOUT } from "./actions/types";
import LoginForm from "./components/registration/LoginForm";
import RegistrationForm from "./components/registration/RegistrationForm";
import SelectedProjectName from "./components/reusable/ProjectNameContainer";
import React from "react";
import TokenWatcher from "./tokenWatcher";

// Private Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

// Top Navigation Menu (Hidden on Login Page)
const TopMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  if (["/", "/projects", "/register"].includes(location.pathname)) return null;

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <SelectedProjectName />
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/workers">
            Workers
          </Button>
          <Button color="inherit" component={Link} to="/shops">
            Shops
          </Button>
          <Button color="inherit" component={Link} to="/projects">
            Projects
          </Button>
        </Box>
        <Button
          color="inherit"
          onClick={() => {
            dispatch({ type: LOGOUT });
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// AppContent component to use hooks
const AppContent = () => {
  return (
    <Router>
      <CssBaseline />
      <TokenWatcher />
      <TopMenu />
      <Container sx={{ width: "100%", marginTop: "100px" }} maxWidth={false}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/workers"
            element={
              <PrivateRoute>
                <Workers />
              </PrivateRoute>
            }
          />
          <Route
            path="/worker-bills/:name"
            element={
              <PrivateRoute>
                <WorkerBills />
              </PrivateRoute>
            }
          />
          <Route
            path="/shops"
            element={
              <PrivateRoute>
                <Shops />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-bills/:name"
            element={
              <PrivateRoute>
                <ShopBills />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

// Main App Component
const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
