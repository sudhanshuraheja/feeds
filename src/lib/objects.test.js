const objects = require('./objects')

describe('Test Objects', () => {
    test('Check isArray', () => {
        expect(objects.isArray(undefined)).toBe(false)
        expect(objects.isArray(null)).toBe(false)
        expect(objects.isArray(123)).toBe(false)
        expect(objects.isArray('asdf')).toBe(false)
        expect(objects.isArray([])).toBe(true)
        expect(objects.isArray({})).toBe(false)
    })

    test('Check isObject', () => {
        expect(objects.isObject(undefined)).toBe(false)
        expect(objects.isObject(null)).toBe(false)
        expect(objects.isObject(123)).toBe(false)
        expect(objects.isObject('asdf')).toBe(false)
        expect(objects.isObject([])).toBe(false)
        expect(objects.isObject({})).toBe(true)
    })

    test('Check isNumber', () => {
        expect(objects.isNumber(undefined)).toBe(false)
        expect(objects.isNumber(null)).toBe(false)
        expect(objects.isNumber(123)).toBe(true)
        expect(objects.isNumber('asdf')).toBe(false)
        expect(objects.isNumber([])).toBe(false)
        expect(objects.isNumber({})).toBe(false)
    })

    test('Check isString', () => {
        expect(objects.isString(undefined)).toBe(false)
        expect(objects.isString(null)).toBe(false)
        expect(objects.isString(123)).toBe(false)
        expect(objects.isString('asdf')).toBe(true)
        expect(objects.isString([])).toBe(false)
        expect(objects.isString({})).toBe(false)
    })

    test('Check hasKey', () => {
        expect(objects.hasKey(undefined, 'abc')).toBe(false)
        expect(objects.hasKey(null, 'abc')).toBe(false)
        expect(objects.hasKey(123, 'abc')).toBe(false)
        expect(objects.hasKey('asdf', 'abc')).toBe(false)
        expect(objects.hasKey([], 'abc')).toBe(false)
        expect(objects.hasKey(['abc'], 0)).toBe(true)
        expect(objects.hasKey(['abc'], 1)).toBe(false)
        expect(objects.hasKey({'abc':'def'}, 'abc')).toBe(true)
        expect(objects.hasKey({'abc':'def'}, 'abc1')).toBe(false)
    })
})