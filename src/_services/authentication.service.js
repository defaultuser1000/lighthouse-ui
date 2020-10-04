import { BehaviorSubject } from 'rxjs';
import { handleResponse } from "../_helpers/handle-response";

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

async function login(username, password) {
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: {'Authorization': createBasicAuthToken(username, password)}
    };

    return await fetch(`/api/users/authenticate`, requestOptions)
        .then((response) => {
            return handleResponse(response);
        }).then((data) => {
            registerSuccessfulLogin(data);
            return data;
        }).catch((error) => {
            return {
                error: error.message,
                hasLoginFailed: true
            };
        });
}

function checkAuth() {
    fetch(`/api/users/check-auth`,
        {
            method: 'GET',
            credentials: 'include'
        }).then((response) => {
            return handleResponse(response);
        });
}

function getDetailedUserProfile() {
    fetch(`/api/users/getUserProfile`,
        {
            method: 'GET',
            credentials: 'include'
        }).then((response) => {
            return handleResponse(response);
        }).then((data) => {
            localStorage.setItem('detailedProfile', data);
            this.forceUpdate();
        }).catch((error) => {
            console.error(error);
        });
}

function logout() {
    localStorage.removeItem('userData');
    currentUserSubject.next(null);
    window.location.href = "/login";
}

function createBasicAuthToken(username, password) {
    return 'Basic ' + window.btoa(username + ":" + password)
}

function registerSuccessfulLogin(localData) {
    localStorage.removeItem('authAlreadyFailed');
    localStorage.setItem('userData', JSON.stringify(localData));
    currentUserSubject.next(localData);
}