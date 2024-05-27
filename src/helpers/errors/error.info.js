const getErrorNotFound = (data) => {
  return `The information for ${data} was not found`;
};

const errorDB = (data) => {
  return `Error connecting to ${data}`;
};

module.exports = { getErrorNotFound, errorDB };
