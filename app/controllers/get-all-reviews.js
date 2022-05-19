const { fetchAllReviews } = require("../models");

exports.getAllReviews = (request, response, next) => {
  const { sort_by, order } = request.query;
  console.log(request.query);
  fetchAllReviews(sort_by, order).then((reviews) => {
    response.status(200).send({ reviews });
  });
};
