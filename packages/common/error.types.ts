class DbQueryNoResultsError extends Error {
  constructor(message: string) {
    super(`No results returned from a query. Details: ${message}`);
    this.name = "DbQueryNoResults";
  }
}

class DbInternalError extends Error {
  constructor(message: string) {
    super(`Querying DB records failed. Details: ${message}`);
    this.name = "DbInternalError";
  }
}
class InvalidParameterError extends Error {
  constructor(message: string) {
    super(`Invalid parameters were provided. Details: ${message}`);
    this.name = "InvalidParameterError";
  }
}

export default {
  DbQueryNoResultsError,
  DbInternalError,
  InvalidParameterError,
};
