const axios = require('axios');

const localStorageKey = 'userInfo';

function getLocalStorageUserInfo() {
    let userInfo = localStorage.getItem(localStorageKey) || '{}';
    return JSON.parse(userInfo);
}

function setLocalStorageUserInfo(userInfo) {
    localStorage.setItem(localStorageKey, JSON.stringify(userInfo));
}

module.exports = {
    checkIfLoggedInUser: (contextSetter) => {
        axios.get('/api/authenticated-only')
        .then((response) => {
            setLocalStorageUserInfo(response.data);
            contextSetter({isLoggedIn: response.data.success});
        })
        .catch((error) => {
            setLocalStorageUserInfo({});
        });
    },
    checkIfLoggedInAdmin: (contextSetter) => {
        axios.get('/api/admin-only')
        .then((response) => {
            setLocalStorageUserInfo(response.data);
            contextSetter(response.data);
        })
        .catch((error) => {
            setLocalStorageUserInfo({});
        });
    },
    getRole: () => {
        let userInfo = getLocalStorageUserInfo();
        return userInfo.role;
    },
    isLoggedIn: () => {
        let userInfo = getLocalStorageUserInfo();
        return userInfo.success === true;
    }
}
