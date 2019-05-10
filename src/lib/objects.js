const objects = {
    isArray: (obj) => {
        return Array.isArray(obj)
    },

    isObject: (obj) => {
        return (typeof obj === 'object') && !objects.isArray(obj) && (obj !== null)
    },

    isNumber: (obj) => {
        return (typeof obj === 'number')
    },

    isString: (obj) => {
        return (typeof obj === 'string')
    },

    hasKey: (obj, key) => {
        if (objects.isArray(obj)) {
            return objects.isNumber(key) && (obj.length > key)
        }
        if(objects.isObject(obj)) {
            const keys = Object.keys(obj)
            return keys.includes(key)
        }
        return false
    }
}

module.exports = objects