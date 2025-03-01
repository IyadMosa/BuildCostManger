import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  CssBaseline,
} from "@mui/material";
import store from "./store";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Workers from "./components/worker/Workers.js";
import WorkerBills from "./components/worker/WorkerBills";
import Shops from "./components/shop/Shops";
import ShopBills from "./components/shop/ShopBills";

// Private Route Component
const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
};

// Top Navigation Menu (Hidden on Login Page)
const TopMenu = () => {
  const location = useLocation();
  if (location.pathname === "/") return null; // Hide menu on login page

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/workers">
            Workers
          </Button>{" "}
          <Button color="inherit" component={Link} to="/shops">
            Shops
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Main App Component
const App = () => (
  <Provider store={store}>
    <Router>
      <CssBaseline />
      <TopMenu />
      <Container sx={{ width: "100%", marginTop: "100px" }} maxWidth={false}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
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
            path="/shop-bills/:name"
            element={
              <PrivateRoute>
                <ShopBills />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  </Provider>
);

export default App;
