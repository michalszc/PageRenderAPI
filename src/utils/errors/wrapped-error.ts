export interface Type<T> extends Function { // eslint-disable-line @typescript-eslint/ban-types
  new(...args: any[]): T; // eslint-disable-line  @typescript-eslint/no-explicit-any
}

export type WrappedError<E extends Error> = {
  _tag: 'WrappedError';
  err: NonNullable<E>;
};

export type ResultOrError<T> = T | WrappedError<any>; // eslint-disable-line  @typescript-eslint/no-explicit-any

export const wrappedError = <E extends Error>(err: E) => ({
    _tag: 'WrappedError' as const,
    err
});

export const isWrappedError =
  <E extends Error>(errorClass: Type<E>) =>
        (v: any): v is WrappedError<E> => ( // eslint-disable-line  @typescript-eslint/no-explicit-any
            v?._tag === 'WrappedError' &&
      v.err instanceof errorClass
        );

export const wrappedErrorField =
    <E extends Error>(_: Type<E>) => // eslint-disable-line @typescript-eslint/no-unused-vars
    <TKey extends keyof E>(prop: TKey) =>
            (wrappedErr: WrappedError<E>): E[TKey] => wrappedErr.err[prop];

export const errorTypesCommonResolvers = <E extends Error>(errorClass: Type<E>) => ({
    __isTypeOf: isWrappedError(errorClass),
    message: wrappedErrorField(errorClass)('message')
});
