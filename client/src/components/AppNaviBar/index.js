import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function AppNaviBar() {
    const history = useHistory();

    const handleLogout = (event) => {
        axios.get("/api/logout")
            .then((response) => {
                history.push("/");
                window.location.reload(false);
            }).catch((error) => {
                alert("An error occurred while logging out.");
            })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-end">
            <ul className="nav justify-content-end">
                <li className="nav-item">
                    <a className="nav-link" href="/">Updates</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/search">Search</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
                </li>
            </ul>
        </nav>
    );
}

export default AppNaviBar;