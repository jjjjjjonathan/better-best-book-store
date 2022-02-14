// Function to generate query strings and query parameters to search for books
// currently only works with title and genre
const searchQueryGenerator = queryObj => {
  const queryParams = [];
  let queryString = `
  SELECT items.*, photo_urls.photo_url FROM items JOIN photo_urls ON item_id = items.id`;
  let whereConditions = [];
  if (queryObj.title) {
    queryParams.push(`%${queryObj.title}%`);
    whereConditions.push(`items.title ILIKE $${queryParams.length}`);
  }
  if (queryObj.genre) {
    queryParams.push(`%${queryObj.genre}%`);
    whereConditions.push(`items.genre ILIKE $${queryParams.length}`);
  }
  if (queryParams.length > 0) {
    queryString += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  queryString += ";";
  return [queryString, queryParams];
};

// Generate random string for listing URLs
const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x100000000000).toString(16).substring(1);
};

module.exports = { searchQueryGenerator, generateRandomString };
