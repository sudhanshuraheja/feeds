class PostgresError extends Error {}
class FileError extends Error {}

module.exports = {
  PostgresError,
  FileError
}