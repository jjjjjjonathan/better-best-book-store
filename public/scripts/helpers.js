// Function to generate query strings and query parameters to search for books
// currently only works with title and genre

const searchQueryGenerator = (queryObj) => {
  const queryParams = [];
  let queryString = `
  SELECT items.*, photo_urls.photo_url FROM items LEFT JOIN photo_urls ON photo_urls.item_id = items.id`;
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
    queryString += ` WHERE ${whereConditions.join(
      " AND "
    )} AND items.sold_status = FALSE;`;
  } else {
    queryString += ` WHERE items.sold_status = FALSE;`;
  }

  return [queryString, queryParams];
};

module.exports = { searchQueryGenerator };
