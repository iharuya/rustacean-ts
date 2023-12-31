// ref: https://doc.rust-lang.org/src/core/result.rs.html

interface BaseResult<T, E> {
	/////////////////////////////////////////////////////////////////////////
	// Querying the contained values
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Returns the contained value or error.
	 */
	get val(): T | E;

	/**
	 * Returns `true` if the result is [`Ok`].
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.isOk() // true
	 * ```
	 */
	isOk(): this is Ok<T>;

	/**
	 * Returns `true` if the result is [`Ok`] and the value inside of it matches a predicate.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.isOkAnd((val) => val > 1) // true
	 * ```
	 */
	isOkAnd(fn: (value: T) => boolean): boolean;

	/**
	 * Returns `true` if the result is [`Err`].
	 * @example
	 * ```
	 * const result = err("serious error")
	 * result.isErr() // true
	 * ```
	 */
	isErr(): this is Err<E>;

	/**
	 * Returns `true` if the result is [`Err`] and the error inside of it matches a predicate.
	 * @example
	 * ```
	 * const result = err("serious error")
	 * result.isErrAnd((err) => err.startsWith("serious")) // true
	 * ```
	 */
	isErrAnd(fn: (error: E) => boolean): boolean;

	/////////////////////////////////////////////////////////////////////////
	// Transforming contained values
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Maps a [`Result<T, E>`] to [`Result<U, E>`] by applying a function to a contained [`Ok`] value,
	 * leaving an [`Err`] value untouched.
	 * This function can be used to compose the results of two functions.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.map((val) => val * 2) // ok(4)
	 * ```
	 */
	map<U>(fn: (value: T) => U): Result<U, E>;

	/**
	 * Returns the provided default (if [`Err`]), or applies a function to the contained value (if [`Ok`]).
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapOr((val) => val * 2, 0) // 4
	 * const badResult = err("error")
	 * badResult.mapOr((val) => val * 2, 0) // 0
	 * ```
	 */
	mapOr<U>(fn: (value: T) => U, defaultValue: U): U;

	/**
	 * Maps a [`Result<T, E>`] to [`U`] by applying function `fn` to a contained [`Ok`] value,
	 * or fallback function `defaultFn` to a contained [`Err`] value
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapOrElse((val) => val * 2, (err) => err.message) // 4
	 * const badResult = err("error")
	 * badResult.mapOrElse((val) => val * 2, (err) => err.message) // "error"
	 * ```
	 */
	mapOrElse<U>(fn: (value: T) => U, defaultFn: (error: E) => U): U;

	/**
	 * Maps a [`Result<T, E>`] to [`Result<T, F>`] by applying a function to a contained [`Err`] value,
	 * leaving an [`Ok`] value untouched.
	 * This function can be used to pass through a successful result while handling an error.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapErr((err) => err.message) // ok(2)
	 * const badResult = err("error")
	 * badResult.mapErr((err) => err.message) // err("error")
	 * ```
	 */
	mapErr<U>(fn: (error: E) => U): Result<T, U>;

	/**
	 * Calls the provided closure with a reference to the contained value if [`Ok`]
	 * @example
	 * ```
	 * const result = ok(2)
	 * result
	 *   .inspect((val) => console.log(val))
	 *   .map((val) => val * 2)
	 * ```
	 */
	inspect(fn: (value: T) => void): Result<T, E>;

	/**
	 * Calls the provided closure with a reference to the contained error if [`Err`]
	 * @example
	 * ```
	 * const result = err("error")
	 * result
	 *   .inspectErr((err) => console.log(err))
	 *   .map((val) => val * 2)
	 * ```
	 */
	inspectErr(fn: (error: E) => void): Result<T, E>;

	/////////////////////////////////////////////////////////////////////////
	// Extract a value
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Returns the contained [`Ok`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.expect("oh no") // 2
	 * ```
	 */
	expect(msg: string): T;

	/**
	 * Returns the contained [`Ok`] value, consuming the `self` value.
	 * Because this function may throw, its use is generally discouraged.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.unwrap() // 2
	 *
	 * const badResult = err("error")
	 * badResult.unwrap() // throws "serious error"
	 * ```
	 */
	unwrap(): T;

	/**
	 * Returns the contained [`Err`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.expectErr("testing err") // throws "testing err: 2"
	 * ```
	 */
	expectErr(msg: string): E;

	/**
	 * Returns the contained [`Err`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.unwrapErr() // throws "2"
	 *
	 * const badResult = err("error")
	 * badResult.unwrapErr() // "error"
	 * ```
	 */
	unwrapErr(): E;

	////////////////////////////////////////////////////////////////////////
	// Boolean operations on the values, eager and lazy
	/////////////////////////////////////////////////////////////////////////
	// UNIMPLEMENTED
}

export class Ok<T> implements BaseResult<T, never> {
	constructor(private value: T) {}
	get val(): T {
		return this.value;
	}

	isOk(): this is Ok<T> {
		return true;
	}

	isOkAnd(fn: (value: T) => boolean): boolean {
		return fn(this.value);
	}

	isErr(): this is never {
		return false;
	}

	isErrAnd(_: (error: never) => boolean): boolean {
		return false;
	}

	map<U>(fn: (value: T) => U) {
		return ok(fn(this.value));
	}

	mapOr<U>(fn: (value: T) => U): U {
		return fn(this.value);
	}

	mapOrElse<U>(fn: (value: T) => U): U {
		return fn(this.value);
	}

	mapErr() {
		return this;
	}

	inspect(fn: (value: T) => void) {
		fn(this.value);
		return this;
	}

	inspectErr() {
		return this;
	}

	expect(_: string) {
		return this.value;
	}

	unwrap(): T {
		return this.value;
	}

	expectErr(msg: string): never {
		unwrapFailed(msg, this.value);
	}

	unwrapErr(): never {
		unwrapFailed("called `Result.unwrapErr()` on an `Ok` value", this.value);
	}
}

export function ok<T>(value: T): Ok<T> {
	return new Ok(value);
}

export class Err<E> implements BaseResult<never, E> {
	constructor(private error: E) {}
	get val(): E {
		return this.error;
	}

	isOk(): this is never {
		return false;
	}

	isOkAnd(_: (value: never) => boolean): boolean {
		return false;
	}

	isErr(): this is Err<E> {
		return true;
	}

	isErrAnd(fn: (error: E) => boolean): boolean {
		return fn(this.error);
	}

	map() {
		return this;
	}

	mapOr<U>(_: (value: never) => U, defaultValue: U): U {
		return defaultValue;
	}

	mapOrElse<U>(_: (value: never) => U, defaultFn: (error: E) => U): U {
		return defaultFn(this.error);
	}

	mapErr<U>(fn: (error: E) => U) {
		return err(fn(this.error));
	}

	inspect() {
		return this;
	}

	inspectErr(fn: (error: E) => void) {
		fn(this.error);
		return this;
	}

	expect(msg: string): never {
		unwrapFailed(msg, this.error);
	}

	unwrap(): never {
		throw this.error;
	}

	expectErr(_: string): E {
		return this.error;
	}

	unwrapErr(): E {
		return this.error;
	}
}

export function err<E>(error: E): Err<E> {
	return new Err(error);
}

export type Result<T, E = Error> = Ok<T> | Err<E>;

function unwrapFailed<E>(msg: string, error: E): never {
	throw new Error(`${msg}: ${error}`);
}

/**
 * Just to feel like it's Rust but be careful: this is only for `Result`.
 */
export function match<T, E, U>(
	result: Result<T, E>,
	okCallback: (value: T) => U,
	errorCallback: (error: E) => U,
): U {
	if (result.isOk()) {
		return okCallback(result.val);
	}
	return errorCallback(result.val);
}
