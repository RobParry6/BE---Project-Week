const db = require("../../db/connection");

exports.fetchAllReviews = (sort_by, order = "DESC") => {
  let queryString = `SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id`;
  const variableArray = [];

  order = order.toUpperCase();
  console.log(sort_by, order);

  if (sort_by) {
    queryString += ` ORDER BY reviews.${sort_by} ${order};`;
    variableArray.push(sort_by);
  } else {
    queryString += ` ORDER BY reviews.created_at ${order}`;
  }
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
