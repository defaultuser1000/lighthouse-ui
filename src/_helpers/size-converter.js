const sizes = {
    0: 'B',
    1: 'KB',
    2: 'MB',
    3: 'GB'
};

export function getSmallestValue(initialValue): string {
    let convertedValue = initialValue;
    let counter = 0;

    do {
        convertedValue /= 1024;
        counter++;
    } while (convertedValue % 1024 > 1024);

    return parseFloat(convertedValue).toFixed(1) + ' ' + sizes[counter];
}