const db = require("../../db/connection");

exports.fetchAllReviews = (review_id) => {
  let queryString =
    "SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id";
  const variableArray = [];

  if (review_id) {
    queryString += " WHERE reviews.review_id = $1 GROUP BY reviews.review_id;";
    variableArray.push(review_id);
  } else {
    queryString +=
      " GROUP BY reviews.review_id ORDER BY reviews.created_at DESC";
  }
  return db.query(queryString, variableArray).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: "Requested Item Not Found Within the Database",
      });
    } else return rows;
  });
};
