let isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value)
        && !isSpecial(value);
};

function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}

function isSpecial(value) {
    let stringValue = Object.prototype.toString.call(value);

    return stringValue === '[object RegExp]'
        || stringValue === '[object Date]'
        || isReactElement(value);
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
let canUseSymbol = typeof Symbol === 'function' && Symbol.for;
let REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
    return (options.clone !== false && options.isMergeableObject(value))
        ? deepmerge(emptyTarget(value), value, options)
        : value;
}

function defaultArrayMerge(target, source, options) {
    return target.concat(source).map((element) => cloneUnlessOtherwiseSpecified(element, options));
}

function mergeObject(target, source, options) {
    let destination = {};
    if (options.isMergeableObject(target)) {
        Object.keys(target).forEach((key) => {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    Object.keys(source).forEach((key) => {
        if (!options.isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        } else {
            destination[key] = deepmerge(target[key], source[key], options);
        }
    });
    return destination;
}

function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;

    let sourceIsArray = Array.isArray(source);
    let targetIsArray = Array.isArray(target);
    let sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
    } if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
    }
    return mergeObject(target, source, options);
}

deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
        throw new Error('first argument should be an array');
    }

    return array.reduce((prev, next) => deepmerge(prev, next, options), {});
};

export default deepmerge;
