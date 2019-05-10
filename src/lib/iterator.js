const objects = require('./objects')

class Iterator {
    constructor(obj) {
        this.obj = obj
        return this
    }

    $(key, returnValue = false) {
        if(objects.isArray(this.obj) || objects.isObject(this.obj)) {
            const value = objects.hasKey(this.obj, key) ? this.obj[key] : undefined
            const object = new Iterator(value)
            return returnValue ? object.value() : object
        }
        const value = undefined
        const object = new Iterator(value)
        return returnValue ? object.value() : object
    }

    keys() {
        if (objects.isArray(this.obj)) {
            return this.obj
        }
        if(objects.isObject(this.obj)) {
            return Object.keys(this.obj)
        }
        return []
    }

    string() {
        return objects.isString(this.obj) ? this.obj.toString() : ''
    }

    value() {
        return this.obj
    }
}

module.exports = Iterator