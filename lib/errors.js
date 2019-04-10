class PostgresClientError extends Error {}
class PostgresQueryError extends Error {}
class FileError extends Error {}

module.exports = {
  PostgresClientError,
  PostgresQueryError,
  FileError
}