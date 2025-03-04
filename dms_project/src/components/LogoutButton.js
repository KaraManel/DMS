import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice"; // Import the logout action
import { Button } from "@mui/material";
import "../assets/styles/Login.css";
const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());  // Clear user state and remove from localStorage
        navigate("/");       // Redirect to login page
    };

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#14CAA5",
                color: "white",
                "&:hover": {
                    backgroundColor: "#10a186",
                },
            }}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
