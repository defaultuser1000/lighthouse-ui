import {authenticationService} from '../_services/authentication.service';

const logoutResponses = [
    'Bad credentials',
    'User is disabled'
];

export function handleResponse(response) {
    return response.text().then(text => {
        let data = "";
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = text;
        }

        if (!response.ok) {
            if (response.status === 401 && logoutResponses.indexOf(data) === -1) {
                authenticationService.logout();
            }

            const error = response.statusText === 'Conflict' ? data : response.statusText + ': ' + JSON.stringify(data);
            throw new Error(error);
        }

        return data;
    });
}