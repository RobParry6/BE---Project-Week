const db = require("../../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else return rows[0];
    });
};
