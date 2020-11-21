import React, { useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AppNaviBar from "./components/AppNaviBar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import PrivateRouteForRoles from "./components/PrivateRouteForRoles"
import ProfilePage from "./components/ProfilePage";
import SiteListPage from "./components/SiteListPage";
import SearchPage from "./components/SearchPage";
import SignupPage from "./components/SignupPage";
import UpdatePage from "./components/UpdatePage";
import UserSeriesContext from "./util/UserSeriesContext";
import './App.css';
import PublicRoute from './components/PublicRoute';

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
                <AppNaviBar />
                <Switch>
                    <Route path="/" component={LandingPage} exact />
                    <PublicRoute path="/login" component={LoginPage} exact />
                    <PublicRoute path="/signup" component={SignupPage} exact />
                    <PrivateRouteForRoles path="/updates" component={UpdatePage} redirectPath="/login" exact/>
                    <PrivateRouteForRoles path="/search" component={SearchPage} redirectPath="/login" exact />
                    <PrivateRouteForRoles path="/profile" component={ProfilePage} redirectPath="/login" exact />
                    <PrivateRouteForRoles path="/sites" component={SiteListPage} roles={['admin']} redirectPath="/login" exact />
                </Switch>
            </Router>
        </UserSeriesContext.Provider>
    );
}

export default App;
