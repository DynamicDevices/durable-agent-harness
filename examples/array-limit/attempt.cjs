// Attempt: move the default into a variable. Zero is still treated as false.
module.exports = function take(items, limit) {
  const count = limit ? limit : 3;
  return items.slice(0, count);
};
