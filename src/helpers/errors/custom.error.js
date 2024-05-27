class CustomError {
  static createError({
    name = "Error",
    desc = "No description provided",
    message = "An unknown error occurred",
    code = 1,
  }) {
    const error = new Error(message);
    error.name = name;
    error.desc = desc;
    error.code = code;
    throw error;
  }
}

module.exports = CustomError;
