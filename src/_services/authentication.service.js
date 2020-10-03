import {BehaviorSubject} from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('userData')));

export const authenticationService = {
    login,
    checkAuth,
    getDetailedUserProfile,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value
    },
    get isAdmin() {
        return currentUserSubject.value && currentUserSubject.value.roles.filter(function(role) { return role.name === 'ADMIN'}).length === 1
    }
};

function login(username, password) {
    const requestOptions = {
        method: 'GET',
        headers: {'Authorization': createBasicAuthToken(username, password)}
    };

    return fetch(`/users/authenticate`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        }).then((data) => {
            registerSuccessfulLogin(data, data.username);
            this.forceUpdate();
        }).catch((error) => {
            return {
                showSuccessMessage: false,
                error: error.message,
                hasLoginFailed: true
            };
        });
}

function checkAuth() {
    fetch(`/users/check-auth`, { method: 'GET' })
        .then((response) => {
            if (response.status === 401
                && localStorage.getItem('userData')
                && sessionStorage.getItem('authenticatedUser')
            ) {
                logout();
            }
        });
}

function getDetailedUserProfile() {
    fetch(`/users/getUserProfile`, { method: 'GET' })
        .then((response) => {
            if (response.ok) {
                if (response.status === 401) {
                    logout();
                    return;
                }
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        }).then((data) => {
            localStorage.setItem('detailedProfile', data);
            this.forceUpdate();
        }).catch((error) => {
            console.error(error);
        });
}

function logout() {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authenticatedUser');
    currentUserSubject.next(null);
    window.location.href = "/login";
}

function createBasicAuthToken(username, password) {
    return 'Basic ' + window.btoa(username + ":" + password)
}

function registerSuccessfulLogin(localData, sessionData) {
    localStorage.setItem('userData', JSON.stringify(localData));
    currentUserSubject.next(localData);
}