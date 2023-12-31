export class Ok<T> {
  constructor(private value: T) {}
  get val(): T {
    return this.value
  }
  is_ok(): this is Ok<T> {
    return true
  }
  is_err(): this is never {
    return false
  }
  unwrap(): T {
    return this.value
  }
}
export function ok<T>(value: T): Ok<T> {
  return new Ok(value)
}

export class Err<E> {
  constructor(private error: E) {}
  get err(): E {
    return this.error
  }
  is_ok(): this is never {
    return false
  }
  is_err(): this is Err<E> {
    return true
  }
  unwrap(): never {
    throw this.error
  }
}
export function err<E>(error: E): Err<E> {
  return new Err(error)
}

export type Result<T, E = Error> = Ok<T> | Err<E>

export function match<T, E, U>(
  result: Result<T, E>,
  okCallback: (value: T) => U,
  errorCallback: (error: E) => U
): U {
  if (result.is_ok()) {
    return okCallback(result.val)
  } else {
    return errorCallback(result.err)
  }
}

// export class Err<E> {
//   kind: 'err';
//   error: E;

//   constructor(error: E) {
//     this.kind = 'err';
//     this.error = error;
//   }
// }

// export class Result<T, E = Error> {
//   private result: Ok<T> | Err<E>;

//   constructor(result: Ok<T> | Err<E>) {
//     this.result = result;
//   }

//   unwrap(): T {
//     if (this.result.kind === 'ok') {
//       return this.result.value;
//     } else {
//       throw this.result.error
//     }
//   }

//   expect(errorMessage: string): T {
//     if (this.result.kind === 'ok') {
//       return this.result.value;
//     } else {
//       throw new Error(errorMessage);
//     }
//   }
// }
