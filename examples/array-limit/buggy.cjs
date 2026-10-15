// Contract: null/undefined use 3; zero returns no items; positive integers cap results.
module.exports = function take(items, limit) {
  return items.slice(0, limit || 3);
};
