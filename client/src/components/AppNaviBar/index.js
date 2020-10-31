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
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-end">
            <ul class="nav justify-content-end">
                <li class="nav-item">
                    <a class="nav-link" href="/">Updates</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/search">Search</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" onClick={handleLogout}>Logout</a>
                </li>
            </ul>
        </nav>
    );
}

export default AppNaviBar;