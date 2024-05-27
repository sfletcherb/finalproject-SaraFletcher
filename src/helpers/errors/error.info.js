const getErrorNotFound = (data) => {
  return `The information for ${data} was not found`;
};

const errorDB = (data) => {
  return `Error connecting to ${data}`;
};

const existsCode = (code) => {
  return `Product with code ${code} already exists`;
};

module.exports = { getErrorNotFound, errorDB, existsCode };
