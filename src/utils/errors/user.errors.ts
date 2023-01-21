export class UsernameTakenError extends Error {
  constructor (options?: ErrorOptions) {
    super(`Username is already in use`, options);
  }
}