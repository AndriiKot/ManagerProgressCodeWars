declare module "#utils" {

  export function deepFreezeArray<T>(arr: T[]): ReadonlyArray<T>;

  export function checkUsersLimit(usersArray: ReadonlyArray<string>): void;

  export function withTimeout<T>(
    promiseFn: () => Promise<T>,
    ms: number,
    retries?: number
  ): Promise<T>;
}
