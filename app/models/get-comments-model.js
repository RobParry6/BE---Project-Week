const db = require("../../db/connection");

exports.fetchComments = (review_id) => {
  const commentPromise = db.query(
    `SELECT * FROM comments WHERE review_id = $1;`,
    [review_id]
  );

  const reviewPromise = db.query(
    `SELECT * FROM reviews WHERE review_id = $1;`,
    [review_id]
  );

  return Promise.all([commentPromise, reviewPromise]).then(
    ([commentResults, reviewResults]) => {
      if (!reviewResults.rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else return commentResults.rows;
    }
  );
};
