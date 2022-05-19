const { fetchAllReviews } = require("../models");

exports.getAllReviews = (request, response, next) => {
  const { sort_by, order, category } = request.query;
  fetchAllReviews(sort_by, order, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
