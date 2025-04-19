import dotenv from "dotenv";
dotenv.config();

/**
 * Retrieves the value of an environment variable.
 * If the variable is not set, it returns the provided default value or throws an error.
 *
 * @param {string} key - The name of the environment variable.
 * @param {string} [defaultValue] - The default value to return if the variable is not set.
 * @returns {string} - The value of the environment variable or the default value.
 * @throws {Error} - Throws an error if the variable is not set and no default value is provided.
 */

export const getEnv = (key, defaultValue) => {
  if (process.env[key]) {
    return process.env[key];
  } else if (defaultValue) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is not set`);
}
