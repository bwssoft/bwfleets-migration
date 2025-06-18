export class MigrationProcessError extends Error {
  constructor(public errors: Array<string>) {
    super()
  }
}