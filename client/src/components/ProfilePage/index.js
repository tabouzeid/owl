import React from "react";

export default function ProfilePage(props) {

    return (
        <div className="container">

            <div className="page-header text-center">
                <h1><span className="fa fa-anchor"></span> Profile Page</h1>
                <a href="/logout" className="btn btn-default btn-sm">Logout</a>
            </div>

            <div className="row">

                <!-- LOCAL INFORMATION -->
                <div className="col-sm-6">
                    <div className="well">
                        <h3><span className="fa fa-user"></span> Local</h3>

                        <
                        % if (user.local.email) { %>
                        <p>
                        <strong>id</strong>: <
                        %= user._id %>
                        <br>
                        <strong>email</strong>: <
                        %= user.local.email %>
                        <br>
                        <strong>password</strong>: <
                        %= user.local.password %>
                    </p>

                    <a href="/unlink/local" className="btn btn-default">Unlink</a>
                    <
                    % } else {%>
                    <a href="/connect/local" class="btn btn-default">Connect Local</a>
                    <% } %>

                    </div>
                    </div>
                    </div>
                    </div>
                    );
                    }