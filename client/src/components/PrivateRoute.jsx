import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // Check if user is authenticated

    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
