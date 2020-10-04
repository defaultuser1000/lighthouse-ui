import {authenticationService} from '../_services/authentication.service';

export function handleResponse(response) {
    return response.text().then(text => {
        let data = "";
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = text;
        }

        if (!response.ok) {
            if (response.status === 401 && data !== 'Bad credentials') {
                authenticationService.logout();
            }

            const error = response.statusText + ': ' + data;
            throw new Error(error);
        }

        return data;
    });
}