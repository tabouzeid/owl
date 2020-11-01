import React, { useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AppNaviBar from "./components/AppNaviBar";
import UpdatePage from "./components/UpdatePage";
import SearchPage from "./components/SearchPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import UserSeriesContext from "./util/UserSeriesContext";
import axios from "axios";
import './App.css';


function App() {
    const [userData, setUserData] = useState({
        isLoggedIn: false,
        seriesList: [],
        siteList: [],
    });

    useLayoutEffect(() => {
        async function startup() {
            try {
                let data = { ...userData };
                const authResponse = await axios.get(`/api/authenticated-only`)
                console.log(authResponse);
                data.isLoggedIn = authResponse.data.success;
                if (data.isLoggedIn) {
                    const siteList = await axios.get('/api/site');
                    data.siteList = siteList.data;
                    setUserData(data);
                }
            } catch (error) {
                console.log("An error happened ", error);
            }
        }

        startup();
    }, []);

    return (
        <UserSeriesContext.Provider value={{ userData: userData }}>
            <Router>
                {userData.isLoggedIn === true ?
                    (<div>
                        <AppNaviBar />
                        <Switch>
                            <Route exact path="/" component={UpdatePage} />
                            <Route exact path="/search" component={SearchPage} />
                            <Route exact path="/login" component={UpdatePage} />
                            <Route exact path="/signup" component={UpdatePage} />
                        </Switch>
                    </div>)
                    :
                    (
                        <Switch>
                            <Route exact path="/" component={LoginPage} />
                            <Route exact path="/search" component={LoginPage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/signup" component={SignupPage} />
                        </Switch>
                    )}
            </Router>
        </UserSeriesContext.Provider>
    );
}

export default App;
