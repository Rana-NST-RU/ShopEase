function getPagination(req) {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '12', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function getSorting(req, allowed = ['price', 'popularity', 'createdAt']) {
  const sortBy = allowed.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  return { [sortBy]: order };
}

function getProductFilters(req) {
  const where = {};
  if (req.query.q) {
    where.name = { contains: req.query.q };
  }
  if (req.query.category) where.category = req.query.category;
  if (req.query.minPrice || req.query.maxPrice) {
    where.price = {};
    if (req.query.minPrice) where.price.gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) where.price.lte = parseFloat(req.query.maxPrice);
  }
  return where;
}

module.exports = { getPagination, getSorting, getProductFilters };


