const errorsMap = {
    1001: 'Username already exist.',
    1002: 'E-Mail already registered.'
};

export default function (codes) {
    return codes.split(',').map(code => errorsMap[code] || `Error code: ${code}`);
}