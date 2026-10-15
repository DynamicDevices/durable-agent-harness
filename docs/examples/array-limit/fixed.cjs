module.exports = function take(items, limit) {
  const count = limit ?? 3;
  return items.slice(0, count);
};
