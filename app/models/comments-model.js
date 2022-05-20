const db = require("../../db/connection");
const { fetchReview } = require("./review-model");

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

exports.addNewComment = ({ user_name, body }, review_id) => {
  const reviewPromise = fetchReview(review_id);

  const postPromise = db.query(
    "INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;",
    [user_name, body, review_id]
  );

  return Promise.all([reviewPromise, postPromise]).then(
    ([reviewResults, postResults]) => {
      if (!reviewResults.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else {
        return postResults.rows;
      }
    }
  );
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      }
    });
};
