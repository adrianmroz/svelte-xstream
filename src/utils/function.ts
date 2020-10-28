export type EmptyFn = () => void;
export type Unary<S, T> = (arg: S) => T;
export type Binary<S, T, U> = (arg1: S, arg2: T) => U;
