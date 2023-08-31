import {
    InvalidInputError,
    isDate, isInRange, isNotEmpty, isNotNull, isNumber, isURL, isUUID,
    isUndefined,
    validate,
    validateDate, validateEmpty, validateInRange, validateInput,
    validateNotNull,
    validateNumber, validateUUID, validateUrl
} from '../../src/utils';

describe('Validations', () => {
    test('should properly validate input with any predict function', () => {
        const fn = (v: unknown) => v === 1;
        expect(validateInput(fn, 'error')(1, 'input')).toBeNull();
        expect(validateInput(fn, 'error')(2, 'input')).toStrictEqual({
            field: 'input',
            message: '2 error'
        });
    });

    test('should check if it is URL', () => {
        expect(isURL('http://example.com')).toBeTruthy();
        expect(isURL('http://example.com/something/')).toBeTruthy();
        expect(isURL('https://example.com')).toBeTruthy();
        expect(isURL('example')).toBeFalsy();
        expect(isURL('example.')).toBeFalsy();
        expect(isURL('.com')).toBeFalsy();
    });

    test('should validate URL', () => {
        expect(validateUrl('http://example.com', 'url')).toBeNull();
        expect(validateUrl('example', 'url')).toStrictEqual({
            field: 'url',
            message: 'example is not a valid URL'
        });
    });

    test('should check if it is UUID', () => {
        expect(isUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9f')).toBeTruthy();
        expect(isUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e93')).toBeTruthy();
        expect(isUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9')).toBeFalsy();
        expect(isUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e933')).toBeFalsy();
    });

    test('should validate UUID', () => {
        expect(validateUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9f', 'id')).toBeNull();
        expect(validateUrl('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9', 'id')).toStrictEqual({
            field: 'id',
            message: '6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9 is not a valid URL'
        });
    });

    test('should check if it is Date', () => {
        expect(isDate('2023-08-23')).toBeTruthy();
        expect(isDate('2022-11-13')).toBeTruthy();
        expect(isDate('2022/11/13')).toBeFalsy();
        expect(isDate('2022.11.13')).toBeFalsy();
    });

    test('should validate Date', () => {
        expect(validateDate('2023-08-23', 'date')).toBeNull();
        expect(validateDate('2023/08/23', 'date')).toStrictEqual({
            field: 'date',
            message: '2023/08/23 is not a valid Date'
        });
    });

    test('should check if it is Number', () => {
        expect(isNumber(23)).toBeTruthy();
        expect(isNumber(4)).toBeTruthy();
        expect(isNumber('test')).toBeFalsy();
        expect(isNumber('number')).toBeFalsy();
    });

    test('should validate Number', () => {
        expect(validateNumber(2, 'number')).toBeNull();
        expect(validateNumber('test', 'number')).toStrictEqual({
            field: 'number',
            message: 'test is not a Number'
        });
    });

    test('should check if it is in range', () => {
        expect(isInRange(0, 100, 60)).toBeTruthy();
        expect(isInRange(-100, 100, 0)).toBeTruthy();
        expect(isInRange(0, 10, 11)).toBeFalsy();
        expect(isInRange(-5, 5, -10)).toBeFalsy();
    });

    test('should validate range', () => {
        expect(validateInRange(2, 'range', { min: 0 })).toBeNull();
        expect(validateInRange(2, 'range', { max: 100 })).toBeNull();
        expect(validateInRange(2, 'range', { min: -1, max: 10 })).toBeNull();
        expect(validateInRange(10, 'range', { min: 11 })).toStrictEqual({
            field: 'range',
            message: '10 should be greater than or equal 11'
        });
        expect(validateInRange(10, 'range', { min: 11, max: 15 })).toStrictEqual({
            field: 'range',
            message: '10 should be between 11 and 15'
        });
    });

    test('should validate length', () => {
        expect(validateInRange(2, 'length', { min: 0 })).toBeNull();
        expect(validateInRange(2, 'length', { max: 100 })).toBeNull();
        expect(validateInRange(2, 'length', { min: -1, max: 10 })).toBeNull();
        expect(validateInRange(10, 'length', { min: 11 })).toStrictEqual({
            field: 'length',
            message: '10 should be greater than or equal 11'
        });
        expect(validateInRange(10, 'length', { min: 11, max: 15 })).toStrictEqual({
            field: 'length',
            message: '10 should be between 11 and 15'
        });
    });

    test('should check if it is not null', () => {
        expect(isNotNull(1)).toBeTruthy();
        expect(isNotNull('test')).toBeTruthy();
        expect(isNotNull(null)).toBeFalsy();
    });

    test('should validate not null', () => {
        expect(validateNotNull(2, 'null')).toBeNull();
        expect(validateNotNull(null, 'null')).toStrictEqual({
            field: 'null',
            message: 'null is not a valid value'
        });
    });

    test('should check if it is undefined', () => {
        expect(isUndefined(10)).toBeFalsy();
        expect(isUndefined('test')).toBeFalsy();
        expect(isUndefined(['test', 1])).toBeFalsy();
        expect(isUndefined({ x: 1 })).toBeFalsy();
        expect(isUndefined(null)).toBeFalsy();
        expect(isUndefined(undefined)).toBeTruthy();
    });

    test('should check if it is not empty', () => {
        expect(isNotEmpty(10)).toBeTruthy();
        expect(isNotEmpty('test')).toBeTruthy();
        expect(isNotEmpty(['test', 1])).toBeTruthy();
        expect(isNotEmpty({ x: 1 })).toBeTruthy();
        expect(isNotEmpty(undefined)).toBeFalsy();
        expect(isNotEmpty(null)).toBeFalsy();
        expect(isNotEmpty([])).toBeFalsy();
        expect(isNotEmpty({})).toBeFalsy();
        expect(isNotEmpty('')).toBeFalsy();
    });

    test('should validate empty', () => {
        expect(validateEmpty(2, 'empty')).toBeNull();
        expect(validateEmpty([], 'empty')).toStrictEqual({
            field: 'empty',
            message: ' cannot be empty'
        });
    });

    test('should validate and pass without errors', () => {
        expect(validate([
            validateUrl('http://example.com', 'url'),
            validateUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9f', 'id'),
            validateEmpty(2, 'empty')
        ])).toBeUndefined();
    });

    test('should validate and throw error', () => {
        expect(() => validate([
            validateUrl('example', 'url'),
            validateUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9', 'id'),
            validateEmpty([], 'empty')
        ])).toThrowError(InvalidInputError);
        expect(() => validate([
            validateUrl('example', 'url'),
            validateUUID('6a1d8f0b-4c3e-2d1a-9f6b-8e7c5a3d0e9', 'id'),
            validateEmpty([], 'empty')
        ])).toThrowError('Input validation failed for fields: [url, id, empty]');
    });
});
