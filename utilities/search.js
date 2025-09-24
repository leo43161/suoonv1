// Definir las reglas de transformación
const transformationRules = [
    {
        name: 'Terminal Omnibus San Miguel de Tucumán',
        values: {
            feature_type: "terminal",
        }
    },
    {
        name: '25 De Mayo De 1810 San Miguel de Tucumán',
        values: {
            name: "25 De Mayo San Miguel de Tucumán"
        }
    },
];
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}
function formatAddress(addresses) {
    return addresses.map(address => {
        for (const rule of transformationRules) {
            if (rule.name === address.name) {
                deepMerge(address, rule.values);
            }
        }
        return address;
    });
}

export { formatAddress };