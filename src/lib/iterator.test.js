const Iterator = require('./iterator')

describe('Test Iterator', () => {
    test('test Iterator', () => {
        let i = new Iterator(undefined)
        expect(i.value()).toBe(undefined)
        i = new Iterator(undefined)
        expect(i.keys()).toEqual([])
        i = new Iterator(undefined)
        expect(i.string()).toBe('')
        i = new Iterator(undefined)
        expect(i.$('key').value()).toBe(undefined)
        i = new Iterator(undefined)
        expect(i.$('key', true)).toBe(undefined)
        i = new Iterator(undefined)
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator(undefined)
        expect(i.$('key').string()).toBe('')

        i = new Iterator(null)
        expect(i.value()).toBe(null)
        i = new Iterator(null)
        expect(i.keys()).toEqual([])
        i = new Iterator(null)
        expect(i.string()).toBe('')
        i = new Iterator(null)
        expect(i.$('key').value()).toBe(undefined)
        i = new Iterator(null)
        expect(i.$('key', true)).toBe(undefined)
        i = new Iterator(null)
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator(null)
        expect(i.$('key').string()).toBe('')

        i = new Iterator(123)
        expect(i.value()).toBe(123)
        i = new Iterator(123)
        expect(i.keys()).toEqual([])
        i = new Iterator(123)
        expect(i.string()).toBe('')
        i = new Iterator(123)
        expect(i.$('key').value()).toBe(undefined)
        i = new Iterator(123)
        expect(i.$('key', true)).toBe(undefined)
        i = new Iterator(123)
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator(123)
        expect(i.$('key').string()).toBe('')

        i = new Iterator('abc')
        expect(i.value()).toBe('abc')
        i = new Iterator('abc')
        expect(i.keys()).toEqual([])
        i = new Iterator('abc')
        expect(i.string()).toBe('abc')
        i = new Iterator('abc')
        expect(i.$('key').value()).toBe(undefined)
        i = new Iterator('abc')
        expect(i.$('key', true)).toBe(undefined)
        i = new Iterator('abc')
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator('abc')
        expect(i.$('key').string()).toBe('')

        i = new Iterator(['abc'])
        expect(i.value()).toEqual(['abc'])
        i = new Iterator(['abc'])
        expect(i.keys()).toEqual(['abc'])
        i = new Iterator(['abc'])
        expect(i.string()).toBe('')
        i = new Iterator(['abc'])
        expect(i.$('key').value()).toBe(undefined)
        i = new Iterator(['abc'])
        expect(i.$('key', true)).toBe(undefined)
        i = new Iterator(['abc'])
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator(['abc'])
        expect(i.$('key').string()).toBe('')

        i = new Iterator({'key': 'abc'})
        expect(i.value()).toEqual({'key':'abc'})
        i = new Iterator({'key': 'abc'})
        expect(i.keys()).toEqual(['key'])
        i = new Iterator({'key': 'abc'})
        expect(i.string()).toBe('')
        i = new Iterator({'key': 'abc'})
        expect(i.$('key').value()).toBe('abc')
        i = new Iterator({'key': 'abc'})
        expect(i.$('key', true)).toBe('abc')
        i = new Iterator({'key': 'abc'})
        expect(i.$('key').keys()).toEqual([])
        i = new Iterator({'key': 'abc'})
        expect(i.$('key').string()).toBe('abc')
    })
})