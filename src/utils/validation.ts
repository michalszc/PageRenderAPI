import { InputFieldError, InvalidInputError } from './errors';
import { Maybe } from '../__generated__/resolvers-types';

export const validateInput = (
    predFn: (v: unknown) => boolean,
    errorMsg: string
) => (v: unknown, inputName: string): Maybe<InputFieldError> => {
    if (predFn(v)) {
        return null;
    } else {
        return {
            field: inputName,
            message: `${v} ${errorMsg}`
        };
    }
};

export const isURL = (v: unknown): boolean => {
    try {
        new URL(String(v)); // eslint-disable-line no-new
    } catch (err) {
        return false;
    }

    return true;
};
export const validateUrl = validateInput(isURL, 'is not a valid URL');

export const isUUID = (v: unknown): boolean => {
    const UUID_REGEX = // eslint-disable-next-line no-useless-escape
        /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;

    return UUID_REGEX.test(String(v));
};
export const validateUUID = validateInput(isUUID, 'is not a valid UUID');

const leapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
export const isDate = (v: unknown): boolean => {
    const datestring = String(v);

    // eslint-disable-next-line no-useless-escape
    const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/;
    if (!RFC_3339_REGEX.test(datestring)) {
        return false;
    }

    const year = Number(datestring.slice(0, 4));
    const month = Number(datestring.slice(5, 7));
    const day = Number(datestring.slice(8, 10));

    switch (month) {
    case 2: // February
        if (leapYear(year) && day > 29) {
            return false;
        } else if (!leapYear(year) && day > 28) {
            return false;
        }

        return true;
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
        if (day > 30) {
            return false;
        }
        break;
    }

    return true;
};
export const validateDate = validateInput(isDate, 'is not a valid Date');

export const isNumber = (v: unknown): boolean => Number.isInteger(Number(v));
export const validateNumber = validateInput(isNumber, 'is not a Number');

export const isInRange = (
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER,
    v: unknown
): boolean => Number(v) >= min && Number(v) <= max;
export const validateInRange = (v: unknown, inputName: string, {
    min = null, max = null
}: Partial<Record<'min' | 'max', number>>) => {
    if (min === null && max === null) { // eslint-disable-next-line max-len
        return validateInput(isInRange.bind(null, 0, Number.MAX_SAFE_INTEGER), 'should be greater than or equal 0')(v, inputName);
    } else if (min === null) {
        return validateInput(isInRange.bind(null, 0, max), `should be between 0 and ${max}`)(v, inputName);
    } else if (max === null) { // eslint-disable-next-line max-len
        return validateInput(isInRange.bind(null, min, Number.MAX_SAFE_INTEGER), `should be greater than or equal ${min}`)(v, inputName);
    } else {
        return validateInput(isInRange.bind(null, min, max), `should be between ${min} and ${max}`)(v, inputName);
    }
};

export const validateLength = (v: unknown, inputName: string, {
    min = null, max = null
}: Partial<Record<'min' | 'max', number>>) => {
    if (min === null && max === null) { // eslint-disable-next-line max-len
        return validateInput(isInRange.bind(null, 0, Number.MAX_SAFE_INTEGER), 'should be greater than or equal 0')(v, inputName);
    } else if (min === null) {
        return validateInput(isInRange.bind(null, 0, max), `should be between 0 and ${max}`)(v, inputName);
    } else if (max === null) { // eslint-disable-next-line max-len
        return validateInput(isInRange.bind(null, min, Number.MAX_SAFE_INTEGER), `should be greater than or equal ${min}`)(v, inputName);
    } else {
        return validateInput(isInRange.bind(null, min, max), `should be between ${min} and ${max}`)(v, inputName);
    }
};

export const isNotNull = (v: unknown): boolean => v !== null;
export const validateNotNull = validateInput(isNotNull, 'is not a valid value');

export const validate = (inputs: Array<Maybe<InputFieldError>>) => {
    const errors: Array<InputFieldError> = inputs.filter(v => v !== null);

    if (errors.length < 1) {
        return;
    }

    throw new InvalidInputError(
        `Input validation failed for fields: [${errors.map(err => err.field).join(', ')}]`,
        errors
    );
};

export const isUndefined = (v: unknown): boolean => v === undefined;
