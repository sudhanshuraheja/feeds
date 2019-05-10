const objects = require('./objects')

class Iterator {
    constructor(obj) {
        this.obj = obj
        return this
    }

    $(key, returnValue = false) {
        if(objects.isArray(this.obj) || objects.isObject(this.obj)) {
            this.obj = objects.hasKey(this.obj, key) ? this.obj[key] : undefined
            return returnValue ? this.obj : this
        }
        this.obj = undefined
        return returnValue ? this.obj : this
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