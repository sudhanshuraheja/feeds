class PostgresClientError extends Error {}
class PostgresQueryError extends Error {}
class RedisError extends Error {}
class FileError extends Error {}

module.exports = {
  PostgresClientError,
  PostgresQueryError,
  RedisError,
  FileError
}