const db = require("../../db/connection");
const { fetchReview } = require("./get-review-model");

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
