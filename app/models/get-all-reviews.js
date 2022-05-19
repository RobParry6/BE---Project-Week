const db = require("../../db/connection");

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  let queryString = `SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  order = order.toUpperCase();
  if (category) {
    queryString += ` WHERE reviews.category = '${category}'`;
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryString).then(({ rows }) => {
    console.log(rows);
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: "Requested Item Not Found Within the Database",
      });
    } else return rows;
  });
};
