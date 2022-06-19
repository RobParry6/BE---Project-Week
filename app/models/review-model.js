const db = require("../../db/connection");

exports.fetchReview = (review_id) => {
  return db
    .query(
      "SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;",
      [review_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          message: "Requested Item Not Found Within the Database",
        });
      } else return rows;
    });
};

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  if (
    !["title", "designer", "owner", "category", "created_at"].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      message: "Bad Request, Very Bad Request! (Invalid Request)",
    });
  }

  if (!["asc", "desc", "ASC", "DESC"].includes(order)) {
    return Promise.reject({
      status: 400,
      message: "Bad Request, Very Bad Request! (Invalid Request)",
    });
  }

  db.query(`SELECT slug FROM categories`).then(({ rows }) => {
    const categoryList = rows.map((category) => category.slug);
    if (category & !categoryList.includes(category)) {
      return Promise.reject({
        status: 404,
        message: "Requested Item Not Found Within the Database",
      });
    }
  });

  let queryString = `SELECT reviews.*, COUNT (comment_id) ::int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`;

  order = order.toUpperCase();
  if (category) {
    queryString += ` WHERE reviews.category = '${category}'`;
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryString).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: "Requested Item Not Found Within the Database",
      });
    } else return rows;
  });
};

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

exports.createReview = ({
  title,
  designer,
  owner,
  review_img_url,
  review_body,
  category,
}) => {
  return db
    .query(
      "INSERT INTO reviews (title, category, designer, owner, review_body, review_img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [title, category, designer, owner, review_body, review_img_url]
    )
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows;
    });
};
