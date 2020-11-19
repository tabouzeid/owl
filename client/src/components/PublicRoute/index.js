import React from 'react';
import { Route } from 'react-router-dom';

export default function PublicRoute(props) {
    let component = props.component;
    let path = props.path;

    return (<Route path={path} component={component} />);
}