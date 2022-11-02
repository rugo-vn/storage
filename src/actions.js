export const put = function ({ key, value }) {
  if (value === undefined) {
    delete this.registers[key];
    return true;
  }

  this.registers[key] = value;
  return true;
};

export const get = function ({ key }) {
  return this.registers[key];
};
