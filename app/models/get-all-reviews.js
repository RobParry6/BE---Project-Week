const db = require("../../db/connection");

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
    if (category & !rows.includes(category)) {
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
