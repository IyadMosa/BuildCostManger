import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "./store";
import { Provider } from "react-redux";
import LoginPage from "./components/LoginPage";
import {Dashboard} from "@material-ui/icons";
import {NavbarScroller} from "@iyadmosa/react-library";
const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    return token ? children : <Navigate to="/" />;
};

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;