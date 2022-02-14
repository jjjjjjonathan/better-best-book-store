const searchQueryStr = queryObj => {
  const queryParams = [];
  let queryString = `
  SELECT items.*, photo_urls.photo_url FROM items JOIN photo_urls ON item_id = items.id`;
  let whereConditions = [];
  if (!!queryObj.title) {
    queryParams.push(`%${queryObj.title}%`);
    whereConditions.push(`items.title ILIKE $${queryParams.length}`);
  }
  if (!!queryObj.genre) {
    queryParams.push(`%${queryObj.genre}%`);
    whereConditions.push(`items.genre ILIKE $${queryParams.length}`);
  }

  if (queryParams.length > 0) {
    queryString += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  queryString += ";";
  return [queryString, queryParams];
};

module.exports = { searchQueryStr };
