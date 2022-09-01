const defTypes = [
    'unknown single wallet service',
    'unidentified service / exchange',
    'small transactions',
    'maximum depth reached',
];

export const isDefaultType = (name) => {
    return defTypes.find(type => type === name)
};