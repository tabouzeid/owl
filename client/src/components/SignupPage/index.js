import React, { useState } from "react";
import { Redirect } from 'react-router'
import axios from "axios";

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [created, setCreated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/api/signup", {
            name: name,
            email: email,
            password: password
        })
            .then((response) => {
                alert("Your new account was successfully created");
                setCreated(true);
            })
            .catch(error => {
                alert("I'm sorry, we have encountered an error with your Login submission.");
            })
    }

    if (created) {
        return <Redirect to='/login' />;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="mx-auto col-8">
                    <h1 className="text-center">Signup</h1>
                    <form onSubmit={handleSubmit} className="mx-auto col-8" style={{ width: "500px" }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={event => setName(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={event => setEmail(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={event => setPassword(event.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-warning btn-lg">Signup</button>
                    </form>

                    <div className="row mt-4">
                        <div className="col-8 text-center mx-auto">
                            <p>Already have an account? <a href="/login">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}