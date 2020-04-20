export class AuthenticationService {

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    isUserLoggedIn() {
        return sessionStorage.getItem('authenticatedUser') !== null;
    }

    registerSuccessfulLogin(localData, sessionData) {
        localStorage.setItem('userData', JSON.stringify(localData));
        sessionStorage.setItem('authenticatedUser', sessionData);
    }

    logout() {
        localStorage.removeItem('userData');
        sessionStorage.removeItem('authenticatedUser');
    }

}