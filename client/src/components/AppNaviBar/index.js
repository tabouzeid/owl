import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const API = require("../../util/API");

function AppNaviBar() {
    const history = useHistory();

    const handleLogout = (event) => {
        axios.get("/api/logout")
            .then((response) => {
                localStorage.setItem("userInfo", "{}");
                history.push("/");
                window.location.reload(false);
            }).catch((error) => {
                alert("An error occurred while logging out.");
            })
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark justify-content-between">
            <a className="navbar-brand " href="/">
                <img src="/logo48.png" width="30" height="30" alt="brand" />
            </a>
            {API.isLoggedIn() ? getLoggedInList(handleLogout) : getLoggedOutList()}
        </nav>
    );
}

function getLoggedInList(handleLogout) {
    return (
    <ul className="navbar-nav">
        <li className="nav-item">
            <a className="nav-link" href="/updates">Updates</a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/search">Search</a>
        </li>
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-user"></i> <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-1.jpg" className="rounded-circle z-depth-0" alt="avatar" height="25" />
            </a>

            <div className="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4" style={{ zIndex: "0" }}>
                <a className="nav-link text-body" href="/profile">Profile</a>
                <a className="nav-link text-body" href="/sites">Sites</a>
                <a className="nav-link text-body" href="#" onClick={handleLogout}>Logout</a>
            </div>
        </li>
    </ul>);
}

function getLoggedOutList() {
    return (<ul className="navbar-nav justify-content-end">
        <li className="nav-item">
            <a className="nav-link" href="/login">Login</a>
        </li>
    </ul>);
}

export default AppNaviBar;