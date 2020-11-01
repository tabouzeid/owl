import React from "react";

export default function ProfilePage(props) {

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6">
                    <form className="mb-5 mt-1 pt-0" onSubmit={updateSettings}>
                        <div className="form-group">
                            <h3 className="mb-0 mt-3">Change Email</h3>
                            <label>New email:</label>
                            <input
                                type="email"
                                style={{
                                    fontFamily: "'Raleway', sans-serif"
                                }}
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={changeField}
                                placeholder={user.email}
                            />
                        </div>
                        <div className="form-group">
                            <h3 className="mb-0 mt-5">Change Name</h3>
                            <label>New username:</label>
                            <input
                                type="text"
                                style={{
                                    fontFamily: "'Raleway', sans-serif"
                                }}
                                className="form-control"
                                id="name"
                                name="name"
                                onChange={changeField}
                                placeholder={user.name}
                            />
                        </div>
                        <div className="form-group">
                            <h3 className="mb-0 mt-5">Change Password</h3>
                            <label>Current password:</label>
                            <input
                                type="password"
                                style={{
                                    fontFamily: "'Raleway', sans-serif"
                                }}
                                className="form-control"
                                id="currentPassword"
                                name="currentPassword"
                                onChange={changeField}
                                placeholder="Enter current password"
                                minLength="8"
                            />
                            <span id="currentPasswordTest" ></span>
                            <div className="row">
                                <div className="col">
                                    <label>New password:</label>
                                    <input
                                        type="password"
                                        style={{
                                            fontFamily: "'Raleway', sans-serif"
                                        }}
                                        className="form-control"
                                        id="newPassword"
                                        name="password"
                                        onChange={changeField}
                                        placeholder="New password"
                                        minLength="8"
                                    />
                                </div>
                                <div className="col">
                                    <label >Confirm new password:</label>
                                    <input
                                        type="password"
                                        style={{
                                            fontFamily: "'Raleway', sans-serif"
                                        }}
                                        className="form-control"
                                        id="reenterNewPassword"
                                        name="reenterNewPassword"
                                        onChange={changeField}
                                        placeholder="New password"
                                        minLength="8"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <button type="submit" className="btn text-white mx-auto" style={{ backgroundColor: "#0060a4" }}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}