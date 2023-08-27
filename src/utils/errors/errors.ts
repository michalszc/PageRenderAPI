import { ErrorWithCause } from 'pony-cause';
import { Type } from './wrapped-error';

export class NotFoundError extends ErrorWithCause<Error> { }
export class UnknownError extends ErrorWithCause<Error> { }

export type InputFieldError = { field: NonNullable<string>; message: NonNullable<string> };
export type InputFieldErrors = Array<InputFieldError>;

export class InvalidInputError extends ErrorWithCause<Error> {
    validations: InputFieldErrors;

    constructor(message: string, validations: InputFieldErrors, cause = new Error()) {
        super(message, { cause });
        this.validations = validations;
    }
}

export const newErrorWithCause =
  <E extends ErrorWithCause<Error>>(ErrorClass: Type<E>) =>
        (e: Error): E => new ErrorClass(e.message, { cause: e });
