const db = require("../../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id; `,
      [review_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else return rows[0];
    });
};
