const axios = require('axios');

const localStorageKey = 'userInfo';

module.exports = {
    checkIfLoggedInUser: (contextSetter) => {
        axios.get('/api/authenticated-only')
        .then((response) => {
            localStorage.setItem(localStorageKey, JSON.stringify(response.data));
            contextSetter({isLoggedIn: response.data.success});
        })
        .catch((error) => {
            localStorage.setItem(localStorageKey, "{}");
        });
    },
    checkIfLoggedInAdmin: (contextSetter) => {
        axios.get('/api/admin-only')
        .then((response) => {
            localStorage.setItem(localStorageKey, JSON.stringify(response.data));
            contextSetter(response);
        })
        .catch((error) => {
            localStorage.setItem(localStorageKey, "{}");
        });
    },
    isLoggedIn: () => {
        let userInfo = localStorage.getItem(localStorageKey) || '{}';
        userInfo = JSON.parse(userInfo);
        return userInfo.success === true;
    }
}
