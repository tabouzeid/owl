import React, { useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AppNaviBar from "./components/AppNaviBar";
import UpdatePage from "./components/UpdatePage";
import SearchPage from "./components/SearchPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import UserSeriesContext from "./util/UserSeriesContext";
import './App.css';

const API = require("./util/API");


function App() {
    const [userData, setUserData] = useState({
        isLoggedIn: API.isLoggedIn(),
    });

    useLayoutEffect(() => {
        API.checkIfLoggedInUser(setUserData);
    }, []);

    return (
        <UserSeriesContext.Provider value={{ userData: userData }}>
            <Router>
                {API.isLoggedIn() === true ?
                    (<div>
                        <AppNaviBar />
                        <Switch>
                            <Route exact path="/" component={UpdatePage} />
                            <Route exact path="/search" component={SearchPage} />
                            <Route exact path="/login" component={UpdatePage} />
                            <Route exact path="/profile" component={ProfilePage} />
                            <Route exact path="/signup" component={UpdatePage} />
                        </Switch>
                    </div>)
                    :
                    (
                        <Switch>
                            <Route exact path="/" component={LoginPage} />
                            <Route exact path="/search" component={LoginPage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/profile" component={LoginPage} />
                            <Route exact path="/signup" component={SignupPage} />
                        </Switch>
                    )}
            </Router>
        </UserSeriesContext.Provider>
    );
}

export default App;
