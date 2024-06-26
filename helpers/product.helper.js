function buildCriteria(query) {
  const criteria = {};

  if (query.name) {
    criteria.name = { $regex: query.name, $options: "i" };
  }
  if (query.category) {
    criteria.category = { $regex: query.category, $options: "i" };
  }
  if (query.minPrice && !isNaN(query.minPrice)) {
    query.minPrice = parseFloat(query.minPrice);
    criteria.price = { $gte: query.minPrice };
  }
  if (query.maxPrice && !isNaN(query.maxPrice)) {
    query.maxPrice = parseFloat(query.maxPrice);
    if (!criteria.price) {
      criteria.price = {};
    }
    criteria.price.$lte = query.maxPrice;
  }
  return criteria;
}

module.exports = {
  buildCriteria,
};
