import React, { useState } from "react";
import { Redirect } from 'react-router';
import axios from "axios";

const API = require("../../util/API");

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/api/login", {
            email: email,
            password: password
        })
            .then((response) => {
                window.location.reload(false);
            })
            .catch(error => {
                alert("I'm sorry, we have encountered an error with your Login submission.");
                // event.target.reset();
            })
    }

    if (API.isLoggedIn()) {
        return <Redirect to='/updates' />;        
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="mx-auto col-8">
                    <h1 className="mx-auto text-center">Login</h1>
                    <form onSubmit={handleSubmit} className="mx-auto col-8" style={{ width: "500px" }}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={event => setEmail(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={event => setPassword(event.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-warning btn-lg">Login</button>
                    </form>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-8 text-center mx-auto">
                    <p className="mx-auto">Need an account? <a href="/signup">Signup</a></p>
                </div>
            </div>
        </div>
    );
}