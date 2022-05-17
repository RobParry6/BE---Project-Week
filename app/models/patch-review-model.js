const db = require("../../db/connection");

exports.changeVotesProperty = (review_id, inc_votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else return rows[0];
    });
};
