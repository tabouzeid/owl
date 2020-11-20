import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import API from "../../util/API";

export default function PrivateRouteForRoles(props) {
    let isLoggedIn = API.isLoggedIn();
    let role = API.getRole();
    let acceptedRoles = props.roles || [];
    let redirectPath = props.redirectPath;
    let component = props.component;
    let path = props.path;

    let roleMatch = true;
    if (acceptedRoles.length > 0 && acceptedRoles.indexOf(role) < 0) {
        roleMatch = false;
    }

    if(isLoggedIn && roleMatch){
        return (<Route path={path} component={component} />);
    } else {
        return (<Redirect to={redirectPath} />);
    }
}